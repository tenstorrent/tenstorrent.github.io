# Local docs preview (see edits when you save)

## One-time setup (repository root)

Create the local Python environment used by `watch_and_serve.py`, `serve-docs-live.sh`, and CI (`.docs-env` is gitignored):

```bash
cd /path/to/tenstorrent.github.io
python3 -m venv .docs-env
.docs-env/bin/pip install -r requirements.txt
```

## Recommended: poll-and-serve (works with Cursor saves)

1. **Open a terminal** in this repository (the directory that contains `watch_and_serve.py`) and run:

   ```bash
   python3 watch_and_serve.py
   ```

2. **Open in your browser:** http://localhost:8010

3. **Edit and save** any file under `core/` or `shared/`. The script polls every 2 seconds; after the next poll it will rebuild. **Refresh the browser** to see your changes.

- **QuietBox BH-2 setup:** http://localhost:8010/systems/quietbox/quietbox-bh-2/setup.html  
- **QuietBox BH-2 specs:** http://localhost:8010/systems/quietbox/quietbox-bh-2/specifications.html  

Leave the terminal open. Press Ctrl+C to stop.

---

**Alternative: Sphinx live reload (port 3000)**  
Run `./serve-docs-live.sh` for sphinx-autobuild. Use http://localhost:3000. Works best when you run that script in your **own** terminal (not from Cursor’s background).
