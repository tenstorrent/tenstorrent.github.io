# Reference Documentation Template

This template provides a structured rubric for creating Reference Documentation. Use this template as a starting point for all technical specifications, API references, and factual documentation.

---

## Template Structure

```markdown
---
myst:
  html_meta:
    product-name: Product Name, Alternative Name, Technology Name
    technology-concepts: Concept1, Concept2, Concept3, Concept4
    document-type: Reference
---

# [Precise Title Including Product/Tool Name and Version]

[One-to-three sentence summary that answers:]
- Who is this for?
- What information does it provide?

Example: "This document provides system administrators and engineers with detailed technical specifications for the TT-QuietBox™ Blackhole™ (TW-04002) workstation. It lists package contents, hardware components, physical dimensions, and operating requirements."

## Package Contents

[If applicable, list what is included with the product:]

The [Product Name] package includes the following items:

* [Item 1]
* [Item 2]
* [Item 3]

:::{warning}
[Any important warnings about package contents, shipping, or handling]
:::

For assembly instructions, refer to the [Setup Guide](./setup.md). If you encounter issues, refer to the [Troubleshooting Guide](./support.md).

## System Specifications

[Use tables for structured specification data:]

| Specification | Details |
| :--- | :--- |
| **Specification Name** | Specification value |
| **Another Spec** | Another value |

## [Category 1: e.g., Processing and Memory]

[Organize specifications by category:]

| Specification | Description |
| :--- | :--- |
| **Spec Name** | Detailed description |
| **Another Spec** | Another description |

## [Category 2: e.g., Storage]

[Continue with categorized specifications:]

| Specification | Description |
| :--- | :--- |
| **Spec Name** | Description |

## [Category 3: e.g., Connectivity]

### [Subcategory: e.g., Internal Connectivity]

| Specification | Description |
| :--- | :--- |
| **Spec Name** | Description |

### [Subcategory: e.g., External Networking]

| Specification | Description |
| :--- | :--- |
| **Spec Name** | Description |

## [Category 4: e.g., Input/Output (I/O)]

### [Subcategory: e.g., Front I/O]

| Specification | Description |
| :--- | :--- |
| **Spec Name** | Description |

### [Subcategory: e.g., Rear I/O]

| Specification | Description |
| :--- | :--- |
| **Spec Name** | Description |

## Environment

[Environmental specifications if applicable:]

| Environmental Specification | Operating Condition | Storage Condition |
| :--- | :--- | :--- |
| **Temperature** | [Range] | [Range] |
| **Relative Humidity** | [Range] | [Range] |

## Safety Warnings

[Include safety information:]

:::{warning}
[Critical safety warning with specific details]
:::

[Additional safety information or links to detailed safety documentation]

## Compliance and Certifications

[If applicable:]

* [Certification 1]
* [Certification 2]
* [Compliance standard]

---

## Related Documentation

* [Setup Guide](./setup.md)
* [Troubleshooting Guide](./support.md)
* [Additional Reference](link-to-reference.md)
```

---

## Quality Checklist

Use this checklist to ensure your reference documentation meets standards:

### Document Structure

- [ ] **Title:** Precise and includes product/tool name and version (if applicable)
  - ✅ Correct: "TT-Buda™ v1.2 API Reference"
  - ✅ Correct: "Technical Specifications"
  - ❌ Incorrect: "Specs" (too vague)

- [ ] **Summary:** One-to-three sentences answering:
  - [ ] Who is this for?
  - [ ] What information does it provide?

- [ ] **Metadata:** Complete myst frontmatter with:
  - [ ] Product names (comma-separated, all variations)
  - [ ] Technology concepts (comma-separated, relevant keywords)
  - [ ] Document type: "Reference"

### Content Quality

- [ ] **Accuracy:** All specifications are:
  - [ ] Factually correct
  - [ ] Up-to-date
  - [ ] Verified against actual hardware/software
  - [ ] Include units of measurement where applicable

- [ ] **Completeness:**
  - [ ] All major categories covered
  - [ ] No critical information missing
  - [ ] Cross-references to related documentation included

- [ ] **Organization:**
  - [ ] Logical grouping of specifications
  - [ ] Clear hierarchy (categories and subcategories)
  - [ ] Consistent formatting throughout

### Formatting

- [ ] **Tables:**
  - [ ] Headers clearly labeled
  - [ ] Consistent column alignment
  - [ ] All data properly formatted
  - [ ] Units included where applicable

- [ ] **Headings:** Sequential hierarchy (H2 → H3 → H4, no skipping)
- [ ] **Lists:** Bulleted lists for package contents and unordered items
- [ ] **Admonitions:** Used appropriately for warnings and important information

### Reference Standards

- [ ] **Precision:** Use exact values, not approximations
- [ ] **Units:** Include units for all measurements
- [ ] **Versioning:** Include version numbers for software/API references
- [ ] **Links:** All cross-references to other documentation are valid

---

## Required Sections Reference

Every Reference Document should include:

1. **Title** (Precise, includes product/tool name)
2. **Summary** (Who + What information provided)
3. **Package Contents** (if applicable)
4. **System Specifications** (organized by category)
5. **Environment** (if applicable)
6. **Safety Warnings** (if applicable)
7. **Compliance and Certifications** (if applicable)
8. **Related Documentation** (links to setup, troubleshooting, etc.)

---

## Example: Complete Reference Structure

Here's how a complete reference document should look:

```markdown
---
myst:
  html_meta:
    product-name: TT-QuietBox, Blackhole
    technology-concepts: specifications, requirements, hardware
    document-type: Reference
---

# Specifications and Requirements

This document provides system administrators and engineers with detailed technical specifications for the TT-QuietBox™ Blackhole™ (TW-04002) workstation. It lists package contents, hardware components, physical dimensions, and operating requirements.

## Package Contents

The Tenstorrent TT-QuietBox Blackhole (TW-04002) system package includes the following items:

* Tenstorrent TT-QuietBox Blackhole System
* C13 Power Cable, 1.8m/6ft.
* 8x QSFP-DD 800GbE Cable, 0.6m/2ft.
* VGA-to-HDMI Adapter

:::{warning}
The TT-QuietBox is shipped in a wooden crate with a total weight of approximately 134 lbs (61 kg). The system itself weighs approximately 80 lbs (36 kg). At least two people are required to move and uncrate the system safely.
:::

For assembly instructions, refer to the [Unboxing and Setting Up the TT-QuietBox Workstation Guide](./setup.md).

## System Specifications

| Specification | Details |
| :--- | :--- |
| **CPU** | AMD EPYC™ 8124P (16 Cores / 32 Threads, up to 3.0 GHz) |
| **Memory** | 512 GB (8x64 GB) DDR5-4800 ECC RDIMM |
| **Storage** | 4 TB NVMe PCIe 4.0 x4 |
| **Power Supply** | 1650W 80 PLUS Platinum |
| **Operating System** | Ubuntu 22.04 LTS |
| **System Dimensions** | 10" x 21.5" x 20" (W x D x H) / 254mm x 546mm x 508mm |
| **System Weight** | 79.2 lbs / 35.9 kg |

## Processing and Memory

| Specification | Description |
| :--- | :--- |
| **AI Accelerator** | 4x Tenstorrent Blackhole™ p150c Tensix Processor |
| **Host Processor** | AMD EPYC 8124P (16 cores) |
| **Host Memory** | 512 GB (8x64 GB) DDR5-4800 ECC RDIMM |

[Continue with additional categories...]
```

---

## Writing Tips

### Specification Tables

**Do:**
* Use consistent units throughout
* Include both metric and imperial where standard practice
* Be precise with measurements
* Group related specifications together

**Do Not:**
* Mix units inconsistently
* Use vague terms like "standard" or "typical"
* Omit critical specifications
* Include marketing language

### Organization

**Structure by:**
* Physical characteristics (dimensions, weight)
* Processing capabilities
* Connectivity options
* Power and environmental requirements
* Compliance and certifications

### Precision

**Be Specific:**
* "512 GB (8x64 GB) DDR5-4800 ECC RDIMM" not "512 GB RAM"
* "10" x 21.5" x 20" (254mm x 546mm x 508mm)" not "approximately 10 inches"
* "1650W 80 PLUS Platinum" not "high-efficiency power supply"

---

## Quality Assurance

Before submitting your reference document, verify:

1. **Accuracy:**
   - [ ] All specifications verified against actual hardware/software
   - [ ] Version numbers current
   - [ ] Measurements correct
   - [ ] Units consistent

2. **Completeness:**
   - [ ] All major categories covered
   - [ ] No critical specifications missing
   - [ ] Package contents listed (if applicable)

3. **Clarity:**
   - [ ] Tables clearly formatted
   - [ ] Categories logically organized
   - [ ] Technical terms defined on first use

4. **Consistency:**
   - [ ] Formatting consistent throughout
   - [ ] Units used consistently
   - [ ] Naming conventions followed

---

## Additional Resources

* [Sphinx Documentation](https://www.sphinx-doc.org/)
* [MyST Markdown Guide](https://mystmd.org/)

---

## Template Usage Notes

1. **Copy this template** to create your reference document
2. **Replace all bracketed placeholders** with actual content
3. **Organize specifications** into logical categories
4. **Use tables** for structured data
5. **Verify all specifications** against actual hardware/software
6. **Include cross-references** to related documentation

Remember: Reference documentation is the definitive source of factual information. Accuracy and precision are paramount.

