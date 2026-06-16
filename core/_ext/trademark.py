"""Sphinx extension: render ® next to TT-QuietBox / Blackhole as superscript."""

from __future__ import annotations

import re
from pathlib import Path
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from sphinx.application import Sphinx

REG_HTML = '<sup class="reg">®</sup>'

_QB_REG = re.compile(r"TT-QuietBox®")
_BH_REG = re.compile(r"Blackhole®")
_SUP_REG = re.compile(r"<sup>®</sup>")


def _rst_wrap(brand: str) -> str:
    """One raw-html blob so RST does not insert a space before the symbol."""
    return f':html:`{brand}{REG_HTML}`'


def _skip_line(line: str) -> bool:
    return "product-name:" in line


def _markdown_line(line: str) -> str:
    if _skip_line(line):
        return line
    line = _SUP_REG.sub(REG_HTML, line)
    line = _QB_REG.sub(f"TT-QuietBox{REG_HTML}", line)
    line = _BH_REG.sub(f"Blackhole{REG_HTML}", line)
    return line


def _rst_line(line: str) -> str:
    if _skip_line(line):
        return line
    if ":html:`" in line and 'class="reg"' in line:
        return line
    line = _QB_REG.sub(_rst_wrap("TT-QuietBox"), line)
    line = _BH_REG.sub(_rst_wrap("Blackhole"), line)
    return line


def _doc_suffix(app: Sphinx, docname: str) -> str:
    for ext in app.config.source_suffix:
        if (Path(app.srcdir) / f"{docname}{ext}").is_file():
            return ext
    return ""


def _preprocess_reg(app: Sphinx, docname: str, source: list[str]) -> None:
    suffix = _doc_suffix(app, docname)
    if suffix == ".md":
        source[0] = "".join(_markdown_line(line) for line in source[0].splitlines(keepends=True))
    elif suffix == ".rst":
        source[0] = "".join(_rst_line(line) for line in source[0].splitlines(keepends=True))


def _html_role(
    name: str,
    rawtext: str,
    text: str,
    lineno: int,
    inliner,
    options: dict | None = None,
    content: list[str] | None = None,
):
    from docutils import nodes

    return [nodes.raw("", text, format="html")], []


def setup(app: Sphinx):
    app.add_role("html", _html_role)
    app.connect("source-read", _preprocess_reg)
    return {"parallel_read_safe": True, "parallel_write_safe": True}
