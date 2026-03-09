@echo off
echo Starting local docs server at http://localhost:8000
echo Open that URL in your browser. Press Ctrl+C to stop.
python -m http.server 8000
pause
