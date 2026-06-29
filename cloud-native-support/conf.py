# Cloud-Native Support — section landing page for docs.tenstorrent.com.
# A small hub project that links out to tt-operator and its component docsites,
# each of which is published independently from its own repo.
import os
from pathlib import Path

project = "Cloud-Native Support"
copyright = "2025, Tenstorrent"
author = "Tenstorrent"
html_title = "Cloud-Native Support"

extensions = [
    "myst_parser",
    "sphinx_copybutton",
    "sphinx_togglebutton",
]
myst_enable_extensions = ["colon_fence", "deflist"]
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
    "logo_link_url": os.environ.get("homepage") or _BASE,
    "search_site_base_url": _BASE,
}


def setup(app):
    app.add_css_file("tt_theme.css")
