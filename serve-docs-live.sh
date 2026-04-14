#!/usr/bin/env sh
# Live-reload preview for the *core* Sphinx project (Systems, LoudBox, etc.).
# Run from anywhere; uses repo-root .venv so you do not need `activate`.
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
VENV_PY="$ROOT/.venv/bin/python"

if [ ! -x "$VENV_PY" ]; then
  echo "No Python venv at .venv (need Sphinx + sphinx-autobuild)." >&2
  echo "From the repo root run:" >&2
  echo "  python3 -m venv .venv" >&2
  echo "  .venv/bin/pip install -r requirements.txt" >&2
  exit 1
fi

cd "$ROOT/core"
echo ""
echo "  Building and serving core docs at http://127.0.0.1:3000/"
echo "  Example — TT-LoudBox setup: http://127.0.0.1:3000/systems/loudbox-bh/setup.html"
echo "  Watching: $ROOT/core  and  $ROOT/shared"
echo "  Press Ctrl+C to stop."
echo ""

exec "$VENV_PY" -m sphinx_autobuild . _build/html \
  --port 3000 \
  --host 127.0.0.1 \
  --watch "$ROOT/shared"
