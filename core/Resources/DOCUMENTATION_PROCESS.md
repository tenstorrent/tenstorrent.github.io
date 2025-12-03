# Documentation Process Guide: Adding a New Systems Product

This guide documents the complete process for adding a new product documentation section to the Tenstorrent documentation site, using the Tenstorrent Galaxy implementation as a reference example.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Creating the Product Structure](#creating-the-product-structure)
4. [Adding Content with Myst Metadata](#adding-content-with-myst-metadata)
5. [Adding PDF Downloads](#adding-pdf-downloads)
6. [Building and Previewing](#building-and-previewing)
7. [Git Workflow](#git-workflow)
8. [Reference: File Structure](#reference-file-structure)

---

## Prerequisites

- Python 3.x installed
- Git access to the repository
- Basic familiarity with Markdown and reStructuredText

---

## Initial Setup

### 1. Activate Virtual Environment

```bash
cd "/path/to/tenstorrent.github.io"
source .venv/bin/activate
```

If the virtual environment doesn't exist, create it:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Verify Dependencies

Ensure all required packages are installed:

```bash
pip install -r requirements.txt
```

---

## Creating the Product Structure

### Step 1: Use the Product Template

The product structure template is located at: `core/systems/_product_template/`

**Template Structure:**
```
_product_template/
├── index.rst          # Main index page with toctree
├── specifications.md   # Technical specifications
├── setup.md          # Setup/installation guide
├── support.md        # Support and troubleshooting
└── images/           # Directory for product images
```

**Note:** Document templates (How-To, Reference, Troubleshooting, Release Notes) are located in `core/Resources/` for reuse across all documentation.

### Step 2: Create Your Product Directory

1. **Copy the template** to create your new product directory:

```bash
cd core/systems
cp -r _product_template your-product-name
```

2. **Rename files appropriately** (if needed):
   - Keep the same structure: `index.rst`, `specifications.md`, etc.
   - Use kebab-case for filenames (e.g., `installation-power-environmental.md`)

### Step 3: Update the Main Index

Edit `core/systems/index.rst` to add your product to the toctree:

```rst
Systems
=======================================
.. toctree::
   :caption: Systems
   :maxdepth: 2
   
   quietbox/quietbox-bh/index
   quietbox/quietbox-wh/index
   t3000/index
   t1000/index
   t7000/index
   your-product-name/index    # Add your product here
```

### Step 4: Customize the Product Index

Edit `core/systems/your-product-name/index.rst`:

```rst
Your Product Name
=======================================

.. toctree::
   :maxdepth: 2

   specifications
   setup
   support
```

**Note:** Adjust the toctree entries to match your actual markdown files.

---

## Adding Content with Myst Metadata

### Understanding Myst Metadata

Myst metadata provides structured information for documentation indexing, search, and categorization. It's added as frontmatter at the top of each Markdown file.

### Format

```markdown
---
myst:
  html_meta:
    product-name: Product Name, Alternative Name, Technology Name
    technology-concepts: Concept1, Concept2, Concept3
    document-type: Reference, Task-Based Guide, Explanation
---

# Your Document Title

Your content here...
```

### Metadata Fields Explained

1. **product-name**: Comma-separated list of product names, technology names, and related terms
   - Example: `Tenstorrent Galaxy Server, Wormhole Networked AI Processor`

2. **technology-concepts**: Comma-separated list of technical concepts, topics, or keywords
   - Example: `Installation, Power Supply, Topology, Networking`

3. **document-type**: Type of document (can be multiple, comma-separated)
   - Common types:
     - `Reference` - Technical specifications, reference material
     - `Task-Based Guide` or `Task-Based Guide (How-To)` - Step-by-step instructions
     - `Explanation` - Conceptual explanations
     - `Prerequisites` - Requirements and prerequisites

### Example: Complete Guide with Metadata

```markdown
---
myst:
  html_meta:
    product-name: Tenstorrent Galaxy Server, Wormhole Networked AI Processor
    technology-concepts: Installation, Power Supply, Topology, Networking
    document-type: Reference, Prerequisites
---

# Installation, Power, and Environmental Requirements

This reference documentation provides professional installers and IT administrators with the critical physical, power, environmental, and networking specifications required to successfully prepare for and deploy the Tenstorrent Galaxy™ Server.

## Physical Specifications and Packaging

Content here...
```

### Reference Examples

Look at existing guides for metadata patterns:

- **QuietBox Setup** (`core/systems/quietbox/quietbox-bh/setup.md`):
  - Product: `TT-QuietBox Blackhole™, Blackhole™ Networked AI Processor, Tensix core`
  - Concepts: `PCIe, QSFP-DD, Installation, Setup, Electrostatic Discharge (ESD), Basic Input/Output System (BIOS)`
  - Type: `Task-Based Guide (How-To)`

- **Specifications** (`core/systems/quietbox/quietbox-bh/specifications.md`):
  - Product: `TT-QuietBox, Blackhole`
  - Concepts: `specifications, requirements, hardware`
  - Type: `Reference`

---

## Adding PDF Downloads

### Step 1: Add PDF File

Place your PDF file in the product directory:

```bash
cp your-guide.pdf core/systems/your-product-name/your_product_user_guide.pdf
```

**Naming convention:** Use lowercase with underscores (e.g., `tenstorrent_galaxy_user_guide.pdf`)

### Step 2: Add Download Link to Index

Edit `core/systems/your-product-name/index.rst`:

```rst
Your Product Name
=======================================

.. toctree::
   :maxdepth: 2

   specifications
   setup
   support

Download User Guide
--------------------

.. raw:: html

   <a href="your_product_user_guide.pdf" target="_blank" download>Your Product User Guide</a>
```

**Key points:**
- Use `.. raw:: html` directive to include HTML
- `target="_blank"` opens in a new tab
- `download` attribute triggers download behavior
- Filename must match the PDF file in the directory

### Step 3: Ensure PDF is Copied to Build Output

**Important:** Sphinx doesn't automatically copy PDF files. After building, manually copy:

```bash
cd core
cp systems/your-product-name/your_product_user_guide.pdf _build/html/systems/your-product-name/
```

**For production:** Consider adding a post-build step to the Makefile to automate this.

---

## Building and Previewing

### Standard Build

```bash
cd core
make html
```

### Clean Build (removes cached files)

```bash
cd core
rm -rf _build
make html
```

### Open in Browser

```bash
# Open main index
open _build/html/index.html

# Open specific product page
open _build/html/systems/your-product-name/index.html
```

### Build Output Location

All HTML files are generated in: `core/_build/html/`

---

## Git Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-product-docs
```

### 2. Stage Changes

```bash
git add -A
```

### 3. Commit with Descriptive Message

```bash
git commit -m "Add [Product Name] documentation section

- Add Technical Specifications guide
- Add Installation and Setup guide
- Add [other guides]
- Add PDF user guide download functionality
- Update systems index to reference new section"
```

### 4. Push to Remote

```bash
git push -u origin feature/your-product-docs
```

### 5. Create Pull Request

Either via GitHub web interface or CLI:

```bash
gh pr create --base main --head feature/your-product-docs \
  --title "Add [Product Name] Documentation Section" \
  --body "Adds comprehensive documentation for [Product Name] including specifications, installation requirements, and setup guides."
```

---

## Reference: File Structure

### Complete Product Directory Structure

```
core/systems/your-product-name/
├── index.rst                          # Main index with toctree and download link
├── specifications.md                  # Technical specifications (with myst metadata)
├── installation-power-environmental.md  # Installation guide (with myst metadata)
├── software-setup-configuration.md     # Software setup guide (with myst metadata)
├── cabling-configuration.md           # Cabling guide (with myst metadata)
├── per-tray-isolation-release.md      # Hardware maintenance guide (with myst metadata)
├── compliance-safety-notices.md       # Compliance guide (with myst metadata)
├── your_product_user_guide.pdf        # PDF user guide
├── images/                            # Product images (optional)
│   └── .gitkeep
└── README_PDF.md                      # Instructions for PDF (optional helper file)
```

### Index.rst Template

```rst
Product Name
=======================================

.. toctree::
   :maxdepth: 2

   specifications
   installation-power-environmental
   software-setup-configuration
   cabling-configuration
   per-tray-isolation-release
   compliance-safety-notices

Download User Guide
--------------------

.. raw:: html

   <a href="your_product_user_guide.pdf" target="_blank" download>Product User Guide</a>
```

### Markdown File Template

```markdown
---
myst:
  html_meta:
    product-name: Product Name, Alternative Name
    technology-concepts: Concept1, Concept2, Concept3
    document-type: Reference, Task-Based Guide
---

# Document Title

Introduction paragraph explaining what this document provides and who it's for.

## Section 1

Content here...

### Subsection 1.1

More content...

## Section 2

Content here...

:::{important}
Important information that users should know.
:::

:::{warning}
Warning about potential issues or safety concerns.
:::
```

---

## Common Markdown Features

### Admonitions (Callout Boxes)

```markdown
:::{note}
This is a note.
:::

:::{important}
This is important information.
:::

:::{warning}
This is a warning.
:::

:::{danger}
This is a danger warning.
:::
```

### Tables

```markdown
| Column 1 | Column 2 | Column 3 |
| :--- | :--- | :--- |
| Row 1 Col 1 | Row 1 Col 2 | Row 1 Col 3 |
| Row 2 Col 1 | Row 2 Col 2 | Row 2 Col 3 |
```

### Links

```markdown
[Link Text](https://example.com)
[Internal Link](specifications.md)
[External Link](https://github.com/tenstorrent/tt-metal)
```

### Code Blocks

````markdown
```bash
command --option value
```

```python
def example():
    return "code"
```
````

---

## Troubleshooting

### PDF Not Appearing After Build

**Problem:** PDF download link doesn't work after rebuilding.

**Solution:** Sphinx doesn't automatically copy PDFs. Manually copy after each build:

```bash
cp core/systems/your-product-name/your_product_user_guide.pdf \
   core/_build/html/systems/your-product-name/
```

### Build Warnings About Missing Files

**Problem:** Warnings like "toctree contains reference to nonexisting document"

**Solution:** 
- Check that all files referenced in `index.rst` actually exist
- Ensure filenames match exactly (case-sensitive)
- Remove references to files you don't need

### Old Content Still Showing

**Problem:** Browser shows old content even after rebuilding.

**Solution:**
1. Do a clean build: `rm -rf _build && make html`
2. Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows/Linux)
3. Clear browser cache

### Metadata Not Working

**Problem:** Myst metadata not being recognized.

**Solution:**
- Ensure frontmatter is at the very top of the file (no content before `---`)
- Check YAML syntax (proper indentation, no tabs)
- Verify closing `---` is present
- Check for special characters that might break YAML parsing

---

## Best Practices

1. **Naming Conventions:**
   - Use kebab-case for filenames: `installation-power-environmental.md`
   - Use descriptive, clear names
   - Keep names consistent across related files

2. **Metadata:**
   - Be comprehensive with product names (include all variations)
   - Include relevant technology concepts for better searchability
   - Choose appropriate document types

3. **Content Organization:**
   - Start with an introduction explaining the document's purpose
   - Use clear section headings
   - Include tables for specifications
   - Use admonitions for important information

4. **Git Workflow:**
   - Create feature branches for new products
   - Write descriptive commit messages
   - Test builds before pushing
   - Create PRs for team review

5. **Testing:**
   - Always rebuild and preview locally before committing
   - Test all links (internal and external)
   - Verify PDF downloads work
   - Check that all images load correctly

---

## Quick Reference Checklist

When adding a new product documentation section:

- [ ] Create product directory from template
- [ ] Update `core/systems/index.rst` to include new product
- [ ] Customize `index.rst` in product directory
- [ ] Create markdown files with myst metadata
- [ ] Add content to each guide
- [ ] Add PDF file (if applicable) and download link
- [ ] Build docs: `cd core && make html`
- [ ] Copy PDF to build output (if applicable)
- [ ] Preview in browser
- [ ] Test all links and downloads
- [ ] Commit changes to feature branch
- [ ] Push to remote
- [ ] Create pull request

---

## Additional Resources

- **Sphinx Documentation:** https://www.sphinx-doc.org/
- **MyST Markdown:** https://mystmd.org/
- **reStructuredText Primer:** https://www.sphinx-doc.org/en/master/usage/restructuredtext/basics.html

---

## Example: Tenstorrent Galaxy Implementation

The Tenstorrent Galaxy documentation serves as a complete reference implementation:

- **Location:** `core/systems/tenstorrent-galaxy/`
- **Guides Created:**
  1. Technical Specifications
  2. Installation, Power, and Environmental Requirements
  3. Software Setup and Configuration
  4. Cabling Configuration (placeholder)
  5. Per-Tray Isolation Release (placeholder)
  6. Compliance and Safety Notices (placeholder)
- **Features:**
  - PDF download functionality
  - Complete myst metadata on all guides
  - Proper toctree structure
  - Clean navigation

Review this implementation for a complete working example of the process documented above.

