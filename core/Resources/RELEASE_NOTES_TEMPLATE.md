# Release Notes Template

This template provides a structured rubric for creating Release Notes. Use this template as a starting point for documenting all user-facing changes for software or hardware releases.

---

## Template Structure

```markdown
---
myst:
  html_meta:
    product-name: Product Name, Version Number
    technology-concepts: release notes, Concept1, Concept2, Concept3
    document-type: Release Notes
---

# [Product Name] [Version Number] Release Notes

[One-to-three sentence summary:]
- What is this release?
- Who should review these notes?
- What are the key highlights?

Example: "This document provides a chronological log of all user-facing changes in TT-Metalium™ Software v2.1.0. System administrators and developers should review these notes to understand new features, improvements, and breaking changes before upgrading."

**Release Date:** [Date]
**Previous Version:** [Previous version number]

---

## Highlights

[Brief overview of the most significant changes:]

* [Major feature or improvement 1]
* [Major feature or improvement 2]
* [Breaking change or important notice]

---

## New Features

### [Feature Category 1]

#### [Feature Name 1]

[Description of the new feature:]

* **What it does:** [Clear description]
* **Why it matters:** [Benefit or use case]
* **How to use:** [Brief usage instructions or link to documentation]

[Optional: Code example]
```python
# Example usage
feature_example()
```

#### [Feature Name 2]

[Continue with additional features...]

### [Feature Category 2]

[Continue with additional feature categories...]

---

## Improvements

### [Category 1: e.g., Performance]

* **[Improvement 1]:** [Description of improvement and impact]
* **[Improvement 2]:** [Description]

### [Category 2: e.g., Usability]

* **[Improvement 1]:** [Description]
* **[Improvement 2]:** [Description]

---

## Bug Fixes

### [Category 1: e.g., Compilation]

* **Fixed:** [Bug description] - [Impact description]
* **Fixed:** [Bug description] - [Impact description]

### [Category 2: e.g., Runtime]

* **Fixed:** [Bug description] - [Impact description]

---

## Breaking Changes

:::{warning}
[Important warning about breaking changes that require user action]
:::

### [Change Category 1]

#### [Breaking Change Name]

**What changed:**
[Description of what changed]

**Impact:**
[Who is affected and how]

**Migration path:**
[Step-by-step instructions for updating code/configurations]

[Optional: Before/After example]
```python
# Before (deprecated)
old_function()

# After (new way)
new_function()
```

#### [Breaking Change Name 2]

[Continue with additional breaking changes...]

---

## Deprecations

### [Deprecated Feature 1]

**Deprecated in:** [Version]
**Removal planned for:** [Version or "Future release"]

[Description of what is deprecated and why]

**Migration:**
[How to update code to use the replacement]

### [Deprecated Feature 2]

[Continue with additional deprecations...]

---

## Known Issues

### [Issue Category 1]

#### [Issue Title]

**Description:** [Clear description of the issue]

**Workaround:** [If available, provide a workaround]

**Status:** [Fixed in vX.X.X / Under investigation / Planned for future release]

#### [Issue Title 2]

[Continue with additional known issues...]

---

## Security Updates

[If applicable:]

### [Security Issue 1]

**CVE Number:** [If applicable]
**Severity:** [Critical / High / Medium / Low]
**Description:** [Description of the security issue]
**Impact:** [Who is affected]
**Resolution:** [How it was fixed or mitigated]

---

## Installation and Upgrade

### System Requirements

[Updated system requirements if changed:]

* [Requirement 1]
* [Requirement 2]

### Upgrade Instructions

[Step-by-step upgrade process:]

1. [Step 1]
2. [Step 2]
3. [Step 3]

:::{important}
[Any critical upgrade notes or prerequisites]
:::

### Downgrade Information

[If applicable, information about downgrading:]

:::{warning}
[Downgrade warnings or limitations]
:::

---

## API Changes

[If applicable, detailed API changes:]

### New APIs

* **[API Name]:** [Description and usage]

### Modified APIs

* **[API Name]:** [What changed and migration path]

### Removed APIs

* **[API Name]:** [What was removed and replacement]

---

## Changelog

[Chronological list of all changes, if detailed changelog is maintained:]

### [Date] - [Category]

* [Change description]
* [Change description]

---

## Acknowledgments

[If applicable:]

* [Contributor or team name] - [Contribution]
* [Contributor or team name] - [Contribution]

---

## Related Documentation

* [Installation Guide](link-to-installation.md)
* [Migration Guide](link-to-migration.md)
* [API Reference](link-to-api.md)

---

## Support

For questions about this release or to report issues, please [raise a support request.](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1)
```

---

## Quality Checklist

Use this checklist to ensure your release notes meet standards:

### Document Structure

- [ ] **Title:** Includes product/tool name and version number
  - ✅ Correct: "TT-Metalium™ Software v2.1.0 Release Notes"
  - ❌ Incorrect: "Release Notes" (missing product and version)

- [ ] **Summary:** One-to-three sentences answering:
  - [ ] What is this release?
  - [ ] Who should review these notes?
  - [ ] What are the key highlights?

- [ ] **Metadata:** Complete myst frontmatter with:
  - [ ] Product names (include version number)
  - [ ] Technology concepts (include "release notes" plus relevant keywords)
  - [ ] Document type: "Release Notes"

### Content Quality

- [ ] **Completeness:**
  - [ ] All user-facing changes documented
  - [ ] Breaking changes clearly marked
  - [ ] Migration paths provided
  - [ ] Known issues listed

- [ ] **Clarity:**
  - [ ] Changes clearly described
  - [ ] Impact explained
  - [ ] Migration steps actionable
  - [ ] Technical terms defined

- [ ] **Organization:**
  - [ ] Changes grouped by category
  - [ ] Most important changes first
  - [ ] Chronological where appropriate

### Formatting

- [ ] **Headings:** Sequential hierarchy (H2 → H3 → H4, no skipping)
- [ ] **Lists:** Bulleted lists for feature lists and changes
- [ ] **Code Blocks:** Used for code examples and migration paths
- [ ] **Admonitions:** Used for warnings about breaking changes

---

## Required Sections Reference

Every Release Notes document should include:

1. **Title** (Product name and version)
2. **Summary** (What release + Who should review)
3. **Release Date** and **Previous Version**
4. **Highlights** (Key changes overview)
5. **New Features** (Organized by category)
6. **Improvements** (Organized by category)
7. **Bug Fixes** (Organized by category)
8. **Breaking Changes** (If any, with migration paths)
9. **Deprecations** (If any, with migration guidance)
10. **Known Issues** (Current limitations)
11. **Installation and Upgrade** (Instructions)
12. **Related Documentation** (Links to guides)

---

## Example: Complete Release Notes Structure

Here's how complete release notes should look:

```markdown
---
myst:
  html_meta:
    product-name: TT-Metalium, v2.1.0
    technology-concepts: release notes, compilation, API, performance
    document-type: Release Notes
---

# TT-Metalium™ Software v2.1.0 Release Notes

This document provides a chronological log of all user-facing changes in TT-Metalium™ Software v2.1.0. System administrators and developers should review these notes to understand new features, improvements, and breaking changes before upgrading.

**Release Date:** November 15, 2024
**Previous Version:** v2.0.5

---

## Highlights

* New compiler optimizations improve performance by up to 30% for certain workloads
* Enhanced API with improved error handling
* Breaking change: Updated tensor format requires code migration

---

## New Features

### Compilation

#### Enhanced Optimization Passes

**What it does:** New compiler optimization passes that improve kernel performance for matrix multiplication operations.

**Why it matters:** Reduces execution time for common AI/ML workloads.

**How to use:** No code changes required. Optimizations are applied automatically during compilation.

### API

#### Improved Error Messages

**What it does:** Error messages now include specific file locations and line numbers.

**Why it matters:** Faster debugging and issue resolution.

**How to use:** Errors automatically include enhanced context.

---

## Improvements

### Performance

* **Matrix Operations:** Improved performance by 25-30% for large matrix multiplications
* **Memory Management:** Reduced memory overhead by 15% in typical workloads

### Usability

* **CLI Output:** More readable command-line output with color coding
* **Documentation:** Updated API documentation with additional examples

---

## Bug Fixes

### Compilation

* **Fixed:** Compiler crash when processing nested loops - Resolves compilation failures for certain model architectures
* **Fixed:** Incorrect memory allocation for large tensors - Prevents out-of-memory errors

### Runtime

* **Fixed:** Memory leak in long-running processes - Improves system stability

---

## Breaking Changes

:::{warning}
This release includes breaking changes that require code updates. Review the migration guide before upgrading.
:::

### API Changes

#### Tensor Format Update

**What changed:**
The default tensor format has changed from row-major to column-major for improved performance.

**Impact:**
All code that directly accesses tensor data will need updates.

**Migration path:**
1. Review your code for direct tensor data access
2. Update indexing to match new format
3. Test thoroughly before deploying

```python
# Before (row-major)
data = tensor[i, j]

# After (column-major)
data = tensor[j, i]
```

See the [Migration Guide](./migration-v2.1.md) for detailed instructions.

---

## Deprecations

### Legacy Compiler Flags

**Deprecated in:** v2.1.0
**Removal planned for:** v2.2.0

The `--legacy-format` flag is deprecated. Use the new `--tensor-format` option instead.

**Migration:**
Replace `--legacy-format` with `--tensor-format=legacy` in your build scripts.

---

## Known Issues

### Compilation

#### Issue: Compiler Warning for Nested Functions

**Description:** The compiler generates warnings (not errors) for deeply nested function definitions, even when code is valid.

**Workaround:** Suppress warnings using `--suppress-warnings` flag if needed.

**Status:** Under investigation, planned fix for v2.1.1

---

## Installation and Upgrade

### System Requirements

* Python 3.8 or higher
* CUDA 11.8 or higher
* 16 GB RAM minimum

### Upgrade Instructions

1. Backup your current configuration files
2. Uninstall previous version: `pip uninstall tt-metalium`
3. Install new version: `pip install tt-metalium==2.1.0`
4. Run migration script: `tt-metalium-migrate --from 2.0.5`

:::{important}
Review breaking changes section before upgrading. Some code modifications may be required.
:::

---

## Related Documentation

* [Installation Guide](./installation.md)
* [Migration Guide](./migration-v2.1.md)
* [API Reference](./api-reference.md)
```

---

## Writing Tips

### Feature Descriptions

**Do:**
* Clearly state what the feature does
* Explain why it matters (benefit)
* Provide usage instructions or links
* Include code examples when helpful

**Do Not:**
* Use marketing language
* Omit usage information
* Assume prior knowledge

### Breaking Changes

**Do:**
* Clearly mark as breaking changes
* Explain what changed
* Describe impact on users
* Provide step-by-step migration path
* Include before/after examples

**Do Not:**
* Bury breaking changes in other sections
* Skip migration instructions
* Assume users will figure it out

### Bug Fixes

**Do:**
* Describe the bug clearly
* Explain the impact
* Note if a workaround existed

**Do Not:**
* Use vague descriptions
* Omit impact information

---

## Quality Assurance

Before submitting your release notes, verify:

1. **Completeness:**
   - [ ] All user-facing changes documented
   - [ ] Breaking changes clearly marked
   - [ ] Migration paths provided
   - [ ] Known issues listed

2. **Accuracy:**
   - [ ] Version numbers correct
   - [ ] Dates accurate
   - [ ] Code examples tested
   - [ ] Links functional

3. **Clarity:**
   - [ ] Changes clearly described
   - [ ] Impact explained
   - [ ] Migration steps actionable
   - [ ] Technical terms defined

4. **Organization:**
   - [ ] Changes grouped logically
   - [ ] Most important changes first
   - [ ] Consistent formatting

---

## Additional Resources

* [Sphinx Documentation](https://www.sphinx-doc.org/)
* [MyST Markdown Guide](https://mystmd.org/)

---

## Template Usage Notes

1. **Copy this template** to create your release notes
2. **Replace all bracketed placeholders** with actual content
3. **Organize changes** by category (Features, Improvements, Bug Fixes)
4. **Clearly mark breaking changes** with warnings
5. **Provide migration paths** for all breaking changes
6. **Include upgrade instructions** with prerequisites
7. **List known issues** with workarounds when available

Remember: Release notes are the primary communication channel for changes. Clarity and completeness help users upgrade successfully.

