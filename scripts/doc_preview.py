#!/usr/bin/env python3
"""
Reliable local preview for core/ Sphinx docs:
rebuild on source changes, serve _build/html with no-cache headers, no WebSockets required.

Run via: make watch   (from repo root or core/)
"""

from __future__ import annotations

import argparse
import http.server
import os
import socketserver
import subprocess
import threading
from pathlib import Path

from watchfiles import DefaultFilter, watch

ROOT = Path(__file__).resolve().parents[1]
CORE = ROOT / "core"
WEBROOT = CORE / "_build" / "html"
VENV_PY = ROOT / ".venv" / "bin" / "python"


class _PreviewFilter:
    """Skip build output so Sphinx writes do not trigger rebuild storms."""

    def __init__(self) -> None:
        self._base = DefaultFilter()

    def __call__(self, change, path: str) -> bool:
        parts = Path(path).parts
        if "_build" in parts:
            return False
        return self._base(change, path)


def _build() -> int:
    env = os.environ.copy()
    env.setdefault("TT_DOCS_LIVE", "1")
    cmd = [
        str(VENV_PY),
        "-m",
        "sphinx",
        "-M",
        "html",
        ".",
        "_build",
    ]
    print("Rebuilding docs…", flush=True)
    proc = subprocess.run(cmd, cwd=str(CORE), env=env)
    if proc.returncode == 0:
        print("Build OK — refresh the page if it did not reload automatically.", flush=True)
    else:
        print(f"Sphinx failed (exit {proc.returncode}). Fix errors above.", flush=True)
    return proc.returncode


class _Handler(http.server.SimpleHTTPRequestHandler):
    """Serve WEBROOT; discourage caching HTML while iterating."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WEBROOT), **kwargs)

    def end_headers(self):
        raw = self.path.split("?", 1)[0]
        if raw.endswith(".html") or raw.endswith("/") or raw in ("/", ""):
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
            self.send_header("Pragma", "no-cache")
        super().end_headers()

    def log_message(self, fmt, *args):
        return


def _serve(host: str, port: int) -> None:
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer((host, port), _Handler) as httpd:
        httpd.serve_forever()


def main() -> None:
    parser = argparse.ArgumentParser(description="Sphinx live preview for core/")
    parser.add_argument("--host", default="0.0.0.0", help="Bind address (default 0.0.0.0)")
    parser.add_argument("--port", type=int, default=3000)
    parser.add_argument(
        "--poll",
        action="store_true",
        default=True,
        help="Force filesystem polling (default: on; reliable with many editors)",
    )
    parser.add_argument("--no-poll", dest="poll", action="store_false")
    parser.add_argument("--debounce", type=int, default=400, help="watchfiles debounce ms")
    args = parser.parse_args()

    if not VENV_PY.is_file():
        raise SystemExit(f"Missing venv Python at {VENV_PY} — create .venv and pip install -r requirements.txt")

    WEBROOT.mkdir(parents=True, exist_ok=True)

    print("Initial build…", flush=True)
    _build()

    t = threading.Thread(target=_serve, args=(args.host, args.port), daemon=True)
    t.start()

    print("", flush=True)
    print("Preview (leave this running while you edit):", flush=True)
    print(f"  http://127.0.0.1:{args.port}/forge/index.html", flush=True)
    print(f"  http://localhost:{args.port}/forge/index.html", flush=True)
    print("", flush=True)

    wf_kw = dict(
        watch_filter=_PreviewFilter(),
        debounce=args.debounce,
        force_polling=args.poll,
        raise_interrupt=False,
    )

    paths = [CORE, ROOT / "shared", ROOT / "syseng"]
    for changes in watch(*paths, **wf_kw):
        if changes:
            _build()


if __name__ == "__main__":
    main()
