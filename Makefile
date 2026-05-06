# Preview Tenstorrent docs from the repo root (no need to cd into core/).
.PHONY: watch serve

watch serve:
	@if ! test -x "$(CURDIR)/.venv/bin/python"; then \
	  echo "First-time setup: creating .venv and installing requirements..."; \
	  python3 -m venv "$(CURDIR)/.venv" && "$(CURDIR)/.venv/bin/pip" install -r "$(CURDIR)/requirements.txt"; \
	fi
	@$(MAKE) -C core $@
