#!/usr/bin/env python3
"""Serve the built docs from output/ so you can view them in a browser."""
import os
import http.server
import socketserver

REPO_ROOT = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(REPO_ROOT, "output")
PORTS_TO_TRY = (8010, 8000, 8080, 8001)

if not os.path.isdir(OUTPUT_DIR):
    print("No output/ directory. Run: python3 build_docs.py")
    raise SystemExit(1)

os.chdir(OUTPUT_DIR)
Handler = http.server.SimpleHTTPRequestHandler
port = None
for PORT in PORTS_TO_TRY:
    try:
        httpd = socketserver.TCPServer(("", PORT), Handler)
        port = PORT
        break
    except OSError as e:
        if "Address already in use" in str(e) or e.errno == 48:
            continue
        raise
if port is None:
    print("No free port. Try closing other servers or run: python3 serve_docs.py")
    raise SystemExit(1)
print(f"Serving docs at http://localhost:{port}")
print("Press Ctrl+C to stop.")
httpd.serve_forever()
