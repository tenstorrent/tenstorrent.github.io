# PR review PDFs

Rendered-page PDFs linked from open documentation PRs for fast review. Each PDF has a cover page
listing the PR's commits and files changed, followed by the pages the PR touches, printed from a
local Sphinx build of the PR head merged onto its base branch.

This branch holds no site content and is never merged. Delete it once the PRs it serves have merged.

| PDF | PR |
|---|---|
| `pr213-install-flow-tt-cli.pdf` | #213 Installing Tenstorrent Software |
| `pr215-serve-models.pdf` | #215 Serve Models |
| `pr218-software-stack-tt-cli.pdf` | #218 Building and Operating overviews |
| `pr221-tt-cli-section.pdf` | #221 Tenstorrent CLI section |

`make_pr_pdfs.py` generates them from local Sphinx builds served over HTTP; it takes the scratch directory and a JSON config mapping each PR to its build directory, port, worktree, and pages.
