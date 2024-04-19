#!/bin/bash

# Set the source and destination directories
core_source_dir="core"
pybuda_source_dir="pybuda"
destination_dir="output"

rm -rf "$destination_dir"

mkdir -p "$destination_dir"

# Build HTML docs for the "core" folder
cd "$core_source_dir"
make html
cd ..

# Move the built HTML docs to the destination directory
mv "$core_source_dir/_build/html" "$destination_dir/core"

# Build HTML docs for the "pybuda" folder
cd "$pybuda_source_dir"
make html

cd ..

mv "$pybuda_source_dir/_build/html" "$destination_dir/pybuda"

# Print a success message
echo "HTML docs built successfully!"