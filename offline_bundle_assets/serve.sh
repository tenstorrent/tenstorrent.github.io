#!/bin/sh
echo "Starting local docs server at http://localhost:8000"
echo "Open that URL in your browser. Press Ctrl+C to stop."
python3 -m http.server 8000
