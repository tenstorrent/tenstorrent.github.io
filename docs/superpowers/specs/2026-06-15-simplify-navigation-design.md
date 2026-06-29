# Simplify Navigation — Design

**Date:** 2026-06-15
**Branch:** `refactor/simplify-navigation`
**Status:** Approved design, pending implementation

## Problem

The left sidebar is too deep and shows too many items to scan comfortably. Two
causes:

1. The RTD theme runs on defaults (no `html_theme_options` set in
   `core/conf.py`), so `titles_only=False` pulls every in-page H2/H3 heading
   (e.g. "Getting Started", "Reference Materials", "Blackhole", "Wormhole")
   into the sidebar as its own node.
2. `navigation_depth` defaults to 4, so the page tree expands several levels
   deep (Home → Systems → TT-QuietBox → setup/specs) on top of those headings.

## Goal

Make the sidebar scannable by flattening depth and removing in-page-heading
clutter. Lowest-risk lever only: theme configuration. No content, toctree, or
URL changes.

## Approach: config-only tuning

Add a single `html_theme_options` block to `core/conf.py`:

```python
html_theme_options = {
    "collapse_navigation": True,   # default, explicit: keep unselected subtrees folded
    "titles_only": True,           # remove in-page H2/H3 headings from the sidebar
    "navigation_depth": 2,         # Home → section → product; leaf pages via page body
}
```

### Resulting behavior

- In-page headings no longer appear in the sidebar — only real page titles.
- Sidebar tree caps at 2 levels, e.g. **Systems → TT-QuietBox (BH)**.
- Leaf pages (`setup`, `specifications`, etc.) drop out of the sidebar and are
  reached by clicking into the product page, which already lists them in its
  body (card grids / per-page toctrees).
- The 5 captions (Software Guides, Hardware Guides, Software, Support, Legal)
  are unchanged.

## Scope

- **In scope:** `core/conf.py` only — add the `html_theme_options` block.
- **Out of scope:** merging captions, restructuring toctrees, removing pages,
  changing URLs. (These were considered as approaches B/C and deferred.)

## Risk & reversibility

One file, three options. Fully reversible by deleting the block. No URLs
change, no pages removed.

## Verification

On the running `make watch` server (http://127.0.0.1:3000/):

1. Reload the home page — sidebar shows section entries with no in-page
   headings.
2. Open a deep page (e.g. a QuietBox product page) — sidebar shows at most
   2 levels; the page body still links to `setup` / `specifications`.
3. Confirm no build errors/new warnings introduced by the change.
