#!/bin/sh
# Build docs, inline CSS/JS so they work when opened directly from the zip,
# then create the zip. Run from repo root.
set -e
REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
echo "Building docs..."
python3 build_docs.py
echo "Inlining CSS and JavaScript for offline viewing..."
python3 inline_docs_assets.py
echo "Adding README and server scripts..."
cp "$REPO_ROOT/offline_bundle_assets"/README-OFFLINE.txt "$REPO_ROOT/offline_bundle_assets"/serve.bat "$REPO_ROOT/offline_bundle_assets"/serve.sh output/ 2>/dev/null || true
echo "Creating zip..."
cd output && zip -r ../docs-offline.zip . -x "*.zip" && cd ..
echo "Done: docs-offline.zip (extract and open index.html in a browser)"
