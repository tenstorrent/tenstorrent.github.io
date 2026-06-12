# Design: `llms.txt` + `AGENTS.md` for the docs.tenstorrent.com universe

Date: 2026-06-12
Branch: `feat/agent-readiness`

## Goal

Produce two machine-/agent-facing entrypoint files that cover **everything** in the
`docs.tenstorrent.com` universe and serve them from the site root:

- `https://docs.tenstorrent.com/llms.txt`
- `https://docs.tenstorrent.com/AGENTS.md`

"The universe" = this repo's core Sphinx site **plus** every public Tenstorrent GitHub
repo whose GitHub Pages is routed under `docs.tenstorrent.com/{repo}/` by the org's
custom domain.

## Why two files

- **`llms.txt`** — the *map*. Follows the [llms.txt spec](https://llmstxt.org/): a single
  H1, one blockquote summary, then H2 sections of curated `[Title](url): description`
  links. An agent reads it to discover *where* everything lives.
- **`AGENTS.md`** — the *operating guide*. Prose + tables: hardware families, software
  stack, environment layout and gotchas, a doc-site routing map, and common developer
  paths. An agent reads it to know *how* to actually help a developer on Tenstorrent
  hardware. It is NOT a second link dump.

Source of inspiration/template: `tenstorrent/tt-vscode-toolkit/llms.txt` (its operational
content — venv map, `TT_METAL_HOME` scope, Blackhole dispatch gotcha, Ubuntu matrix,
env-var table, developer paths — is generalized into `AGENTS.md`).

## Coverage method (decided: "verified crawl")

Every URL in both files is verified to return HTTP 200 under the live domain before
inclusion. Major projects get 3–6 verified sub-page links; long-tail / single-page repos
get one line. Repos that carry a GitHub `has_pages` flag but do **not** resolve under the
domain are excluded (e.g. `tt-llk` → 404).

## Verified universe (snapshot 2026-06-12)

### Core site (this repo → site root)
- Home `/`
- Getting Started: `/getting-started/README.html`, `model-demos`, `vLLM-servers`,
  `tt-software-stack`, `manual-software-install`
- Hardware — AIBs: `/aibs/index.html` (+ grayskull / wormhole / blackhole subtrees)
- Hardware — Systems: `/systems/index.html` (loudbox-bh, quietbox/{quietbox-bh, quietbox-bh-2, quietbox-wh}, t1000, t3000, t7000)
- Software: `/forge/index.html`, `/tools/index.html`
- Support: `/support/README.html`
- Software & Utilities (syseng): `/syseng/latest/index.html`
- Legal: `/bounty_terms.html`, `/os-model-terms.html`

### API docs (tt-metal repo)
- TT-NN: `/tt-metal/latest/ttnn/index.html`
- TT-Metalium: `/tt-metal/latest/tt-metalium/index.html`

### Per-repo Pages (19 verified)
riescue, riscv-coretp, tt-animatediff, tt-awesome, tt-blacksmith, tt-CableGen, tt-forge,
tt-forge-onnx, tt-lang, tt-local-generator, tt-mlir, tt-studio, tt-system-firmware,
tt-tm-assets, tt-toplike, tt-torch (marked deprecated upstream), tt-vscode-toolkit,
tt-xla, ttnn-visualizer

## `llms.txt` section taxonomy

1. `# Tenstorrent Documentation` + blockquote summary
2. `## Getting Started`
3. `## Hardware` (AIBs + systems)
4. `## Software Stack & Compilers` (tt-forge, tt-mlir, tt-torch, tt-xla, tt-forge-onnx, tt-lang, TT-NN, TT-Metalium)
5. `## Inference & Serving`
6. `## Training` (tt-blacksmith)
7. `## Tools & Utilities` (tt-toplike, ttnn-visualizer, tt-CableGen, tt-studio, tt-vscode-toolkit, riescue, riscv-coretp, syseng)
8. `## Demos & Examples` (tt-animatediff, tt-local-generator, tt-awesome)
9. `## Reference & Legal` (bounty terms, OS/model terms, brand assets)
10. `## External Resources` (github org, marketplace, etc.)

## `AGENTS.md` outline

- Intro: who this is for + how the docs universe is laid out
- Hardware families (Wormhole / Blackhole) + key constraints
- Software stack table (Metalium → TTNN → Forge/XLA/ONNX → tt-lang → vLLM → installer/smi)
- Environment layout & gotchas (venv map, `TT_METAL_HOME` scope, `hf` CLI, Blackhole
  dispatch, multi-device API, Ubuntu matrix, model/scratch paths)
- **Doc-site routing map** — table of `docs.tenstorrent.com/{path}` → owning repo
- Common developer paths
- Key environment variables table
- Maintenance note (how to regenerate / re-verify)

## Deployment

- Create `core/_extra/llms.txt` and `core/_extra/AGENTS.md`.
- Add `html_extra_path = ['_extra']` to `core/conf.py`. Sphinx copies the directory
  contents verbatim into the build output root; `build_docs.py` moves `core/_build/html/`
  to `output/`, landing the files at the site root.
- No change to `build_docs.py` required.

## Out of scope

- `llms-full.txt` (not requested).
- Auto-regeneration tooling/CI (manual re-verify for now; noted in AGENTS.md maintenance).
- Editing downstream repos' own docs.
