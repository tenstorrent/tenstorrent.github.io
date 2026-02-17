#!/usr/bin/env python3
"""
Serve the docs and rebuild whenever a file under core/ or shared/ changes.
Run this script, then open http://localhost:8000 and refresh after each save.
"""
import os
import subprocess
import sys
import threading
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler

REPO_ROOT = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(REPO_ROOT, "output")
WATCH_DIRS = [os.path.join(REPO_ROOT, "core"), os.path.join(REPO_ROOT, "shared")]
POLL_INTERVAL = 2
BUILD_SCRIPT = os.path.join(REPO_ROOT, "build_docs.py")
VENV_PYTHON = os.path.join(REPO_ROOT, ".docs-env", "bin", "python")
PORT = 8010


def get_latest_mtime(dir_path):
    """Return the latest mtime of any file under dir_path."""
    latest = 0
    for root, _, files in os.walk(dir_path):
        for name in files:
            path = os.path.join(root, name)
            try:
                latest = max(latest, os.path.getmtime(path))
            except OSError:
                pass
    return latest


def run_build():
    """Run the docs build using the venv so sphinx-build is on PATH."""
    env = os.environ.copy()
    venv_bin = os.path.join(REPO_ROOT, ".docs-env", "bin")
    if os.path.isdir(venv_bin):
        env["PATH"] = os.path.pathsep.join([venv_bin, env.get("PATH", "")])
    python = VENV_PYTHON if os.path.isfile(VENV_PYTHON) else sys.executable
    print("\n[watch] Change detected — rebuilding docs...")
    try:
        subprocess.run(
            [python, BUILD_SCRIPT],
            cwd=REPO_ROOT,
            env=env,
            check=True,
            capture_output=True,
            text=True,
        )
        print("[watch] Build finished. Refresh your browser.")
    except subprocess.CalledProcessError as e:
        print(f"[watch] Build failed: {e.stderr or e}")


def watch_loop():
    """Poll watched directories and trigger build on change."""
    last_mtimes = {}
    for d in WATCH_DIRS:
        if os.path.isdir(d):
            last_mtimes[d] = get_latest_mtime(d)

    while True:
        time.sleep(POLL_INTERVAL)
        for d in WATCH_DIRS:
            if not os.path.isdir(d):
                continue
            current = get_latest_mtime(d)
            if current > last_mtimes.get(d, 0):
                last_mtimes[d] = current
                run_build()
                # Update all so we don't rebuild again immediately
                for x in WATCH_DIRS:
                    if os.path.isdir(x):
                        last_mtimes[x] = get_latest_mtime(x)
                break


def main():
    if not os.path.isdir(OUTPUT_DIR):
        print("Running initial build...")
        run_build()

    os.chdir(OUTPUT_DIR)
    handler = SimpleHTTPRequestHandler
    server = HTTPServer(("0.0.0.0", PORT), handler)

    watcher = threading.Thread(target=watch_loop, daemon=True)
    watcher.start()

    print(f"Serving at http://localhost:{PORT}")
    print("Watching core/ and shared/ — save a file and refresh the browser.")
    print("Press Ctrl+C to stop.\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
        server.shutdown()


if __name__ == "__main__":
    main()
