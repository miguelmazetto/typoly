/* Copyright 2026 Miguel Ferreira Mazetto
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License.
*/
// fs.hpp - Traditional header file for fs functions (not a module)
// This works around MSVC C++20 module bug with <filesystem>
#pragma once

#include <filesystem>
#include <fstream>
#include <string>
#include <vector>
#include <sstream>
#include <optional>
#include <stdexcept>
#include <chrono>

// We need std::string for the API - the module will convert to/from String
namespace typoly_std_fs {

// Helper to convert std::string to path
inline std::filesystem::path toPath(const std::string& s) {
    return std::filesystem::path(s);
}

inline std::filesystem::path toPath(const char* s) {
    return std::filesystem::path(s);
}

// existsSync
inline bool existsSync(const std::string& path) {
    return std::filesystem::exists(toPath(path));
}

inline bool existsSync(const char* path) {
    return std::filesystem::exists(toPath(path));
}

// readFileSync
inline std::string readFileSync(const std::string& path) {
    std::ifstream file(path);
    if (!file.is_open()) {
        throw std::runtime_error("ENOENT: no such file or directory, open '" + path + "'");
    }
    std::stringstream buffer;
    buffer << file.rdbuf();
    return buffer.str();
}

inline std::string readFileSync(const char* path) {
    return readFileSync(std::string(path));
}

// writeFileSync
inline void writeFileSync(const std::string& path, const std::string& data) {
    std::ofstream file(path);
    if (!file.is_open()) {
        throw std::runtime_error("ENOENT: no such file or directory, open '" + path + "'");
    }
    file << data;
}

inline void writeFileSync(const char* path, const char* data) {
    writeFileSync(std::string(path), std::string(data));
}

inline void writeFileSync(const std::string& path, const char* data) {
    writeFileSync(path, std::string(data));
}

inline void writeFileSync(const char* path, const std::string& data) {
    writeFileSync(std::string(path), data);
}

// appendFileSync
inline void appendFileSync(const std::string& path, const std::string& data) {
    std::ofstream file(path, std::ios::app);
    if (!file.is_open()) {
        throw std::runtime_error("ENOENT: no such file or directory, open '" + path + "'");
    }
    file << data;
}

inline void appendFileSync(const char* path, const char* data) {
    appendFileSync(std::string(path), std::string(data));
}

inline void appendFileSync(const std::string& path, const char* data) {
    appendFileSync(path, std::string(data));
}

inline void appendFileSync(const char* path, const std::string& data) {
    appendFileSync(std::string(path), data);
}

// mkdirSync
inline void mkdirSync(const std::string& path) {
    std::filesystem::create_directories(toPath(path));
}

inline void mkdirSync(const char* path) {
    mkdirSync(std::string(path));
}

// rmSync
inline void rmSync(const std::string& path) {
    auto p = toPath(path);
    if (std::filesystem::is_directory(p)) {
        std::filesystem::remove_all(p);
    } else {
        std::filesystem::remove(p);
    }
}

inline void rmSync(const char* path) {
    rmSync(std::string(path));
}

// cwd
inline std::string cwd() {
    return std::filesystem::current_path().string();
}

// path utilities
inline std::string basename(const std::string& path) {
    return toPath(path).filename().string();
}

inline std::string dirname(const std::string& path) {
    return toPath(path).parent_path().string();
}

inline std::string extname(const std::string& path) {
    return toPath(path).extension().string();
}

inline std::string join(const std::string& a, const std::string& b) {
    return (toPath(a) / toPath(b)).string();
}

}
