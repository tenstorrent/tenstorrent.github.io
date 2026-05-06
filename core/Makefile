# Minimal makefile for Sphinx documentation
#

# Repo root (parent of this core/ directory) — for venv + shared theme watch
THIS_MAKEFILE := $(lastword $(MAKEFILE_LIST))
REPO_ROOT     := $(abspath $(dir $(THIS_MAKEFILE))..)
VENV_PY       := $(REPO_ROOT)/.venv/bin/python

# You can set these variables from the command line, and also
# from the environment for the first two.
SPHINXOPTS    ?=
SPHINXBUILD   ?= sphinx-build
SOURCEDIR     = .
BUILDDIR      = _build
# Same layout as `make html` (sphinx -M html writes HTML under $(BUILDDIR)/html/).
WEBROOT       = $(BUILDDIR)/html

# Preview server (scripts/doc_preview.py): rebuild on save + no-cache HTML + JS HEAD polling.
HOST          ?= 0.0.0.0
PORT          ?= 3000
SERVE_PORT    ?= 8766

# doc_preview.py uses watchfiles force_polling when WATCH_POLL=1 (default).
WATCH_POLL    ?= 1

# Put it first so that "make" without argument is like "make help".
help:
	@$(SPHINXBUILD) -M help "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)

# Development (watch): build the documentation and watch for changes.
# Uses repo-root .venv so `sphinx-autobuild` does not need to be on PATH.
# Run from this directory: cd core && make watch
watch:
	@test -x "$(VENV_PY)" || (echo "Missing $(VENV_PY) — run: cd \"$(REPO_ROOT)\" && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt" >&2; exit 1)
	@$(VENV_PY) "$(REPO_ROOT)/scripts/doc_preview.py" --host "$(HOST)" --port $(PORT) $(if $(filter 1,$(WATCH_POLL)),--poll,--no-poll)

# One-shot HTML build + stdlib HTTP server (no live reload). Useful if autobuild misbehaves.
serve:
	@test -x "$(VENV_PY)" || (echo "Missing $(VENV_PY) — run: cd \"$(REPO_ROOT)\" && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt" >&2; exit 1)
	@"$(VENV_PY)" -m sphinx -M html "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)
	@echo ""
	@echo "Serving built HTML (stop with Ctrl+C). Open:"
	@echo "  http://127.0.0.1:$(SERVE_PORT)/forge/index.html"
	@echo "  http://localhost:$(SERVE_PORT)/forge/index.html"
	@echo ""
	@cd "$(WEBROOT)" && "$(VENV_PY)" -m http.server $(SERVE_PORT) --bind $(HOST)

.PHONY: help Makefile watch serve

# Catch-all target: route all unknown targets to Sphinx using the new
# "make mode" option.  $(O) is meant as a shortcut for $(SPHINXOPTS).
%: Makefile
	@$(SPHINXBUILD) -M $@ "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)