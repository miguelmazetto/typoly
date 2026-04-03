Below is a complete implementation that includes:

- A custom `shared_ptr` that stores only a pointer to a control block (so it fits in a pointer‑sized slot).
- A `Union` class that:
  - Flattens nested unions (e.g., `Union<Union<A,B>, C>` → `Union<A,B,C>`).
  - Removes duplicate types.
  - Stores the active value directly in an internal union of all the types (no dynamic allocation inside the `Union`).
  - Uses placement new and explicit destructor calls for correct lifetime management.
  - Provides a templated `as<T>()` method that returns a reference to the stored value if the active type matches.

```cpp
#include <cstddef>
#include <stdexcept>
#include <type_traits>
#include <tuple>
#include <utility>
#include <memory>   // for std::addressof

// -----------------------------------------------------------------------------
// Custom shared_ptr that is just a pointer (fits in void*)
// -----------------------------------------------------------------------------
template <typename T>
class shared_ptr {
private:
    struct ControlBlock {
        T        object;
        size_t   ref_count;

        template <typename... Args>
        explicit ControlBlock(Args&&... args) : object(std::forward<Args>(args)...), ref_count(1) {}
    };

    ControlBlock* ctrl_;

public:
    // Constructors
    shared_ptr() noexcept : ctrl_(nullptr) {}

    template <typename... Args>
    explicit shared_ptr(Args&&... args) : ctrl_(new ControlBlock(std::forward<Args>(args)...)) {}

    // Copy / move
    shared_ptr(const shared_ptr& other) noexcept : ctrl_(other.ctrl_) {
        if (ctrl_) ++ctrl_->ref_count;
    }

    shared_ptr(shared_ptr&& other) noexcept : ctrl_(other.ctrl_) {
        other.ctrl_ = nullptr;
    }

    shared_ptr& operator=(const shared_ptr& other) noexcept {
        if (this != &other) {
            this->~shared_ptr();
            new (this) shared_ptr(other);
        }
        return *this;
    }

    shared_ptr& operator=(shared_ptr&& other) noexcept {
        if (this != &other) {
            this->~shared_ptr();
            new (this) shared_ptr(std::move(other));
        }
        return *this;
    }

    ~shared_ptr() {
        if (ctrl_ && --ctrl_->ref_count == 0) {
            delete ctrl_;
        }
    }

    // Access
    T* operator->() const noexcept { return &ctrl_->object; }
    T& operator*() const noexcept { return ctrl_->object; }
    T* get() const noexcept { return ctrl_ ? &ctrl_->object : nullptr; }

    explicit operator bool() const noexcept { return ctrl_ != nullptr; }
};

// -----------------------------------------------------------------------------
// Helper traits for flattening and deduplication
// -----------------------------------------------------------------------------
template <typename...> class Union;

template <typename> struct is_union_specialization : std::false_type {};
template <typename... Ts> struct is_union_specialization<Union<Ts...>> : std::true_type {};

template <typename...> struct TypeList {};

template <typename...> struct Concat;
template <typename... As, typename... Bs>
struct Concat<TypeList<As...>, TypeList<Bs...>> {
    using type = TypeList<As..., Bs...>;
};

template <typename, typename> struct Contains;
template <typename T, typename... Us>
struct Contains<T, TypeList<Us...>> : std::disjunction<std::is_same<T, Us>...> {};

template <typename, typename> struct Unique;
template <typename... Ts>
struct Unique<TypeList<Ts...>> {
    using type = typename Unique<TypeList<>, TypeList<Ts...>>::type;
};

template <typename... Acc, typename T, typename... Rest>
struct Unique<TypeList<Acc...>, TypeList<T, Rest...>> {
    using type = std::conditional_t<
        Contains<T, TypeList<Acc...>>::value,
        typename Unique<TypeList<Acc...>, TypeList<Rest...>>::type,
        typename Unique<TypeList<Acc..., T>, TypeList<Rest...>>::type
    >;
};

template <typename... Acc>
struct Unique<TypeList<Acc...>, TypeList<>> {
    using type = TypeList<Acc...>;
};

template <typename> struct Flatten;
template <typename T>
struct Flatten {
    using type = TypeList<T>;
};
template <typename... Ts>
struct Flatten<Union<Ts...>> {
    using type = typename Flatten<TypeList<Ts...>>::type;
};
template <>
struct Flatten<TypeList<>> {
    using type = TypeList<>;
};
template <typename T, typename... Rest>
struct Flatten<TypeList<T, Rest...>> {
    using type = typename Concat<
        typename Flatten<T>::type,
        typename Flatten<TypeList<Rest...>>::type
    >::type;
};

template <typename... Ts>
using FlattenedUnique = typename Unique<
    typename Flatten<TypeList<Ts...>>::type
>::type;

// -----------------------------------------------------------------------------
// The Union implementation using a union of all types
// -----------------------------------------------------------------------------
template <typename... Ts>
class Union {
private:
    static constexpr size_t NumTypes = sizeof...(Ts);
    static constexpr size_t EMPTY = NumTypes;

    // Type list for iteration
    using Types = std::tuple<Ts...>;

    // Helper to get type at index I
    template <size_t I> using TypeAt = typename std::tuple_element<I, Types>::type;

    // Storage: an aligned union that can hold any of the Ts
    using Storage = typename std::aligned_union_t<0, Ts...>;

    Storage storage_;
    size_t  index_;

    // Helper to call a lambda for the active type (if any)
    template <typename F>
    void visit(F&& f) const {
        if (index_ == EMPTY) return;
        [&]<size_t... Is>(std::index_sequence<Is...>) {
            ((Is == index_ ? (f.template operator()<TypeAt<Is>>(std::integral_constant<size_t, Is>{})) : (void)0), ...);
        }(std::index_sequence_for<Ts...>{});
    }

    // Destroy the active object
    void destroy() {
        visit([]<typename U>(auto) {
            reinterpret_cast<U*>(&storage_)->~U();
        });
        index_ = EMPTY;
    }

    // Copy from another Union (assumes *this is empty or destroyed)
    void copy_from(const Union& other) {
        if (other.index_ == EMPTY) return;
        other.visit([this]<typename U>(auto idx) {
            new (&storage_) U(*reinterpret_cast<const U*>(&other.storage_));
            index_ = idx;
        });
    }

    // Move from another Union (assumes *this is empty or destroyed)
    void move_from(Union&& other) {
        if (other.index_ == EMPTY) return;
        other.visit([this]<typename U>(auto idx) {
            new (&storage_) U(std::move(*reinterpret_cast<U*>(&other.storage_)));
            index_ = idx;
        });
        other.destroy();
    }

public:
    // Default constructor – empty state
    Union() : index_(EMPTY) {}

    // Constructor for any of the allowed types
    template <typename T, typename = std::enable_if_t<Contains<T, FlattenedUnique<Ts...>>::value>>
    Union(const T& value) : index_(EMPTY) {
        new (&storage_) T(value);
        index_ = find_index<T>();
    }

    template <typename T, typename = std::enable_if_t<Contains<T, FlattenedUnique<Ts...>>::value>>
    Union(T&& value) : index_(EMPTY) {
        new (&storage_) T(std::move(value));
        index_ = find_index<T>();
    }

    // Copy / move
    Union(const Union& other) : index_(EMPTY) {
        copy_from(other);
    }

    Union(Union&& other) noexcept : index_(EMPTY) {
        move_from(std::move(other));
    }

    Union& operator=(const Union& other) {
        if (this != &other) {
            destroy();
            copy_from(other);
        }
        return *this;
    }

    Union& operator=(Union&& other) noexcept {
        if (this != &other) {
            destroy();
            move_from(std::move(other));
        }
        return *this;
    }

    ~Union() {
        destroy();
    }

    // Access the stored value as type T
    template <typename T>
    T& as() {
        const size_t idx = find_index<T>();
        if (index_ != idx)
            throw std::bad_variant_access();
        return *reinterpret_cast<T*>(&storage_);
    }

    template <typename T>
    const T& as() const {
        const size_t idx = find_index<T>();
        if (index_ != idx)
            throw std::bad_variant_access();
        return *reinterpret_cast<const T*>(&storage_);
    }

private:
    // Find the index of a type in the flattened unique list
    template <typename T>
    static constexpr size_t find_index() {
        return find_index_impl<T>(FlattenedUnique<Ts...>{});
    }

    template <typename T, typename... Us>
    static constexpr size_t find_index_impl(TypeList<Us...>) {
        size_t idx = 0;
        ((std::is_same_v<T, Us> ? (idx = idx) : ++idx), ...);
        return idx;
    }
};

// -----------------------------------------------------------------------------
// Example usage
// -----------------------------------------------------------------------------
/*
#include <iostream>
#include <string>

int main() {
    // Flattening and deduplication
    Union<Union<int, float>, double, int> u1 = 42;
    std::cout << u1.as<int>() << '\n';   // 42

    Union<Union<int, float>, double, int> u2 = 3.14f;
    std::cout << u2.as<float>() << '\n'; // 3.14

    // Custom shared_ptr
    Union<shared_ptr<std::string>> u3 = shared_ptr<std::string>("hello");
    std::cout << *u3.as<shared_ptr<std::string>>() << '\n'; // "hello"

    // Non‑integral types stored by value (no pointers)
    Union<std::string> u4 = std::string("world");
    std::cout << u4.as<std::string>() << '\n'; // "world"

    // Trying to access wrong type throws
    try {
        u4.as<int>();
    } catch (const std::bad_variant_access& e) {
        std::cout << "Exception: " << e.what() << '\n';
    }
}
*/
```

### Key Points

- **Custom `shared_ptr`**  
  - Stores only a single pointer to a `ControlBlock` that contains the reference count and the managed object.  
  - Fits in a pointer‑sized slot (size of `void*`).  
  - Provides copy/move semantics that correctly adjust the reference count.  
  - Uses `new` only for the control block; the `Union` itself never uses `new`.

- **`Union` class**  
  - **Flattening** and **duplicate removal** are performed via the type traits at compile time.  
  - Uses an **aligned union** (`std::aligned_union_t`) as storage, large enough to hold any of the allowed types.  
  - Manages the active member with placement new and explicit destructor calls – no dynamic allocation inside the `Union`.  
  - **`as<T>()`** checks the active index and returns a reference to the stored object, throwing `std::bad_variant_access` on mismatch.  
  - Supports any type that is copy‑constructible and move‑constructible.  

This design satisfies all requirements: no `new` inside `Union`, flattened nested unions, type‑safe construction, and a `as<T>()` method that returns a reference to the stored value. The custom `shared_ptr` works seamlessly because it is stored by value in the `Union`’s storage and participates in shared ownership.