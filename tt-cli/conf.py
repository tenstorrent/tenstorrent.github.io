# Tenstorrent CLI (tt) — reference for docs.tenstorrent.com/tt-cli/.
# A small project that documents the tt command groups in more depth than
# the Getting Started install guide, which stays brief by design.
import os

project = "Tenstorrent CLI"
copyright = "2026, Tenstorrent"
author = "Tenstorrent"
html_title = "Tenstorrent CLI"

extensions = [
    "myst_parser",
    "sphinx_copybutton",
    "sphinx_togglebutton",
]
myst_enable_extensions = ["colon_fence", "deflist"]
myst_heading_anchors = 3
source_suffix = {".md": "markdown", ".rst": "restructuredtext"}

html_theme = "sphinx_rtd_theme"
html_theme_options = {
    "collapse_navigation": False,
    "titles_only": True,
    "navigation_depth": 2,
}
templates_path = ["../shared/_templates"]
html_static_path = ["../shared/_static"]
html_logo = "../shared/images/tt_logo.svg"
html_favicon = "../shared/images/favicon.png"
html_last_updated_fmt = "%b %d, %Y"

_BASE = "https://docs.tenstorrent.com/"
html_context = {
    "project_code": "tt-cli",
    "logo_link_url": os.environ.get("homepage") or _BASE,
    "search_site_base_url": _BASE,
}


def setup(app):
    app.add_css_file("tt_theme.css")
