cmake_minimum_required(VERSION 3.28)
project(typoly_stdlib LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Typoly Standard Library - Static Library
# This library provides the C++20 modules for Typoly's standard types

# Source files for the stdlib modules
# Note: fs.mxx uses <filesystem> which has MSVC C++20 module issues
set(STDLIB_SOURCES
    union.mxx
    builtin_basic_types.mxx
    typed_arrays.mxx
    text_encoding.mxx
    console.mxx
    math.mxx
    path.mxx
    os.mxx
    process.mxx
    crypto.mxx
    json.mxx
    regexp.mxx
    date.mxx
    builtin.mxx
    fs.mxx
)

# Create static library with module file set
add_library(typoly_stdlib STATIC ${STDLIB_SOURCES})

# Set file extensions for C++ modules
set_source_files_properties(${STDLIB_SOURCES} PROPERTIES 
    LANGUAGE CXX
    CXX_SCAN_FOR_MODULES TRUE
)

# Add module files to the target with proper file set
target_sources(typoly_stdlib
    PUBLIC
    FILE_SET CXX_MODULES FILES
        ${STDLIB_SOURCES}
)

# Include directory for the library (includes fs.hpp)
target_include_directories(typoly_stdlib PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})

# Compiler options
if(MSVC)
    target_compile_options(typoly_stdlib PRIVATE /W4 /EHsc)
else()
    target_compile_options(typoly_stdlib PRIVATE -Wall -Wextra)
endif()

# Link libraries for platform-specific code
if(WIN32)
    target_link_libraries(typoly_stdlib PRIVATE psapi)
endif()

message(STATUS "Typoly Standard Library configured")
message(STATUS "  C++ Standard: C++20")
message(STATUS "  Module sources: ${STDLIB_SOURCES}")
