# Tenstorrent Galaxy PDF User Guide

## Adding the PDF

1. Place your PDF file in this directory (`core/systems/tenstorrent-galaxy/`) with the filename `tenstorrent_galaxy_user_guide.pdf`
2. The PDF will automatically be copied to the build output during documentation generation
3. The download link is already configured in `index.rst` using Sphinx's `:download:` directive

## Alternative: Custom Filename

If your PDF has a different name, update the link in `index.rst`:

```rst
:download:`Tenstorrent Galaxy User Guide <your_filename.pdf>`
```

## Alternative: Link in Markdown

You can also add download links in any `.md` file:

```markdown
[Download Tenstorrent Galaxy User Guide](tenstorrent_galaxy_user_guide.pdf)
```

Or with a custom label:

```markdown
[Download the complete user guide](tenstorrent_galaxy_user_guide.pdf)
```

