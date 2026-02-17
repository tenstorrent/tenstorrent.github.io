#!/usr/bin/env bash
# Serve the built docs (no live reload). Run 'source .docs-env/bin/activate && python build_docs.py' first to rebuild.
# Open http://localhost:8000 in your browser.
set -e
cd "$(dirname "$0")"
echo "Serving output/ at http://localhost:8000"
echo "Press Ctrl+C to stop."
python3 -m http.server 8000 --directory output
