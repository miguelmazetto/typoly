export module index;
import typoly_std_builtin;
using namespace typoly_std_builtin;
import fs;
namespace fs2 { using namespace fs; };
namespace index {
    void main() {
        fs2::readFile("./test.txt", [](auto err, auto data) {
            console::log("read finished");
        });
        console::log("Hello via Bun!");
    }
}
