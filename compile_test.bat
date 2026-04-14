@echo off
cd test_package\.typoly_built\cpp
cmake -B build
cmake --build build
cd ..\..\..