# Docs image format

Use the **figure** directive with **`:width:`** for images in MyST/Markdown docs (e.g. under `core/`).

**Format:**

```markdown
:::{figure} path/to/image.png
:width: 70%
:::
```

- Adjust the percentage (e.g. `70%` = 30% smaller) as needed.
- Path is relative to the current document.

This keeps images displaying correctly in the built site and allows consistent scaling.
