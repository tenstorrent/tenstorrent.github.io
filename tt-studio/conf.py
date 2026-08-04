# TT-Studio documentation for docs.tenstorrent.com/tt-studio/.
import os

project = "TT-Studio"
copyright = "2026, Tenstorrent"
author = "Tenstorrent"
html_title = "TT-Studio"

extensions = [
    "myst_parser",
    "sphinxcontrib.mermaid",
    "sphinx_copybutton",
    "sphinx_togglebutton",
]
myst_enable_extensions = [
    "colon_fence",
    "deflist",
]
myst_fence_as_directive = ["mermaid"]
myst_heading_anchors = 3
source_suffix = {".md": "markdown", ".rst": "restructuredtext"}

# Some reproduced code samples use a language Pygments can't lex cleanly.
suppress_warnings = ["misc.highlighting_failure"]

html_theme = "sphinx_rtd_theme"
html_theme_options = {
    "collapse_navigation": False,
    "titles_only": True,
    "navigation_depth": 2,
}
templates_path = ["../shared/_templates"]
html_static_path = ["../shared/_static", "_static"]
html_logo = "../shared/images/tt_logo.svg"
html_favicon = "../shared/images/favicon.png"
html_last_updated_fmt = "%b %d, %Y"
html_baseurl = "https://docs.tenstorrent.com/tt-studio/"

_BASE = "https://docs.tenstorrent.com/"
html_context = {
    "logo_link_url": os.environ.get("homepage") or _BASE,
    "search_site_base_url": _BASE,
}

mermaid_version = "10.9.1"
mermaid_light_theme = "neutral"
mermaid_dark_theme = "neutral"
mermaid_init_config = {
    "startOnLoad": False,
    "fontFamily": "Arial, Helvetica, sans-serif",
    "flowchart": {"useMaxWidth": True, "htmlLabels": True, "curve": "basis"},
    "sequence": {"useMaxWidth": True},
}


def setup(app):
    app.add_css_file("tt_theme.css")
    app.add_css_file("home.css")
    app.add_css_file("mermaid-tweaks.css")
