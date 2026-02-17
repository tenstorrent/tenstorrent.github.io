#!/usr/bin/env bash
# Serve docs with live reload. Edits in core/ or shared/ will rebuild automatically.
# Open http://localhost:3000 in your browser.
set -e
cd "$(dirname "$0")"
source .docs-env/bin/activate
cd core && make watch
