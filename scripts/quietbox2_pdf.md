# QuietBox 2 user guide PDF

The docs site hosts the PDF. It does not build it. Generate the file outside this repo, then commit the PDF and the version line on the QuietBox 2 index.

## Generator

**Repository (private):** [github.com/dhelmuthTT/qb2-user-guide-generator](https://github.com/dhelmuthTT/qb2-user-guide-generator)

The generator is not part of this repository. Clone it next to your docs checkout (or set `TT_DOCS_REPO` to this checkout). The main script is `build_quietbox2_user_guide.py`.

**Access:** If you cannot open the private repo, ask **Dave Helmuth** (`@dhelmuthTT` on GitHub or Slack) for access, or email [support@tenstorrent.com](mailto:support@tenstorrent.com) and mention the QuietBox 2 PDF generator.

> Note: This is a temporary home under `@dhelmuthTT` because creating a new repo under the `tenstorrent` org requires an org admin. Ask an admin to **transfer** the repo to `tenstorrent/qb2-user-guide-generator` when convenient, then update this page’s link.

From the generator folder:

```bash
git clone https://github.com/dhelmuthTT/qb2-user-guide-generator.git
cd qb2-user-guide-generator
python -m pip install python-docx Pillow
python build_quietbox2_user_guide.py --force
```

That reads the QuietBox 2 web pages (specifications, setup, compliance, and their figures) and writes one version and one date into both places: the PDF cover (`Version 1.<N>`) and the index download line. Do not edit either by hand. The PR check reads both files and fails if those strings differ.

The revision is `1.<N>`, where `<N>` is the number of git commits that touch those source pages. Do not type the version by hand.

Commit the PDF and `core/systems/quietbox/quietbox-bh-2/index.rst`. Do not commit the intermediate `.docx`.

Requires Python 3 with `python-docx` and `Pillow`, plus Microsoft Word (macOS) or LibreOffice for the PDF export.
