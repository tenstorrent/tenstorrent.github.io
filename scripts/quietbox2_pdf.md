# QuietBox 2 user guide PDF

The docs site hosts the PDF. It does not build it. Generate the file outside this repo, then commit the PDF and the version line on the QuietBox 2 index.

## Generator

The generator is `qb2-user-guide-generator` (script `build_quietbox2_user_guide.py`). It is not part of this repository. Keep a checkout of it next to this docs repo, or set `TT_DOCS_REPO` to this checkout.

From the generator folder:

```bash
python build_quietbox2_user_guide.py --force
```

That reads the QuietBox 2 web pages (specifications, setup, compliance, and their figures), writes `core/systems/quietbox/quietbox-bh-2/tt-quietbox-2-user-guide.pdf`, and sets the index download line to the same revision and date as the PDF cover.

The revision is `1.<N>`, where `<N>` is the number of git commits that touch those source pages. Do not type the version by hand.

Commit the PDF and `core/systems/quietbox/quietbox-bh-2/index.rst`. Do not commit the intermediate `.docx`.

Requires Python 3 with `python-docx` and `Pillow`, plus Microsoft Word (macOS) or LibreOffice for the PDF export.
