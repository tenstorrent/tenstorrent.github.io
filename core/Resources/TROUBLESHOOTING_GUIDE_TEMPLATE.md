# Troubleshooting Guide Template

This template provides a structured rubric for creating Troubleshooting Guides. Use this template as a starting point for all problem-and-solution documentation.

---

## Template Structure

```markdown
---
myst:
  html_meta:
    product-name: Product Name, Alternative Name, Technology Name
    technology-concepts: troubleshooting, Concept1, Concept2, Concept3
    document-type: Troubleshooting
---

# Troubleshooting [Problem Category or Product Name] Issues

[One-to-three sentence summary that answers:]
- Who is this for?
- What problems does it help resolve?

Example: "This guide assists users in diagnosing and resolving common hardware issues with the TT-QuietBox™ system, including system instability, boot failures, and long-term maintenance tasks such as coolant refilling."

## [Problem 1: Descriptive Problem Name]

[Brief description of when this problem occurs or what symptoms indicate this issue.]

**Symptoms:**
* [Symptom 1]
* [Symptom 2]
* [Symptom 3]

**Cause:** [Clear explanation of what causes the problem]

**Solution:** [Brief summary of the solution]

[Step-by-step resolution:]

1. [Step 1 description]
2. [Step 2 description]
3. [Step 3 description]

[Optional: Include code blocks for verification]
```bash
$ verification-command
```

[Expected output]
```
Expected output here
```

[Optional: Include images showing the problem or solution]
![](problem_image.png)

[Optional: Include warnings or notes]
:::{warning}
[Warning about potential risks or data loss]
:::

:::{note}
[Additional context or helpful information]
:::

**If this does not resolve the issue:**
[Link to support or additional troubleshooting steps]

---

## [Problem 2: Descriptive Problem Name]

[Continue with the same structure for each problem:]

**Symptoms:**
* [Symptom 1]
* [Symptom 2]

**Cause:** [Explanation]

**Solution:** [Summary]

[Step-by-step resolution]

---

## [Problem 3: Descriptive Problem Name]

[Continue pattern for all problems]

---

## Diagnostic Tools and Commands

[If applicable, include common diagnostic commands:]

### Verifying Hardware Recognition

```bash
$ diagnostic-command
```

**Expected Output:**
```
Expected output showing successful recognition
```

### Checking System Status

```bash
$ status-command
```

**Expected Output:**
```
Expected status output
```

---

## Common Questions

[FAQ-style section for common questions:]

### [Question 1: How do I...?]

[Clear, direct answer]

### [Question 2: Which... should I use?]

[Answer with specific recommendations and reasoning]

---

## Need Additional Support?

If you encounter any issues, or have a question that is not covered in the documentation, please [raise a support request.](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) Our team will review your request and provide assistance.

---

## Related Documentation

* [Setup Guide](./setup.md)
* [Technical Specifications](./specifications.md)
* [Additional Troubleshooting Resources](link-to-resources.md)
```

---

## Quality Checklist

Use this checklist to ensure your troubleshooting guide meets standards:

### Document Structure

- [ ] **Title:** Describes the problem or error message
  - ✅ Correct: "Resolving PCIe Link Training Errors"
  - ✅ Correct: "Troubleshooting Common Hardware Issues"
  - ❌ Incorrect: "Problems" (too vague)

- [ ] **Summary:** One-to-three sentences answering:
  - [ ] Who is this for?
  - [ ] What problems does it help resolve?

- [ ] **Metadata:** Complete myst frontmatter with:
  - [ ] Product names (comma-separated, all variations)
  - [ ] Technology concepts (include "troubleshooting" plus relevant keywords)
  - [ ] Document type: "Troubleshooting"

### Content Quality

- [ ] **Problem-Solution Structure:** Each issue includes:
  - [ ] Clear symptoms
  - [ ] Root cause explanation
  - [ ] Step-by-step solution
  - [ ] Verification steps

- [ ] **Clarity:**
  - [ ] Symptoms clearly described
  - [ ] Causes explained in understandable terms
  - [ ] Solutions are actionable
  - [ ] Steps are numbered and sequential

- [ ] **Completeness:**
  - [ ] Common issues covered
  - [ ] Diagnostic commands included
  - [ ] Support escalation path provided

### Formatting

- [ ] **Headings:** Sequential hierarchy (H2 → H3 → H4, no skipping)
- [ ] **Lists:** 
  - [ ] Bulleted lists for symptoms
  - [ ] Numbered lists for solution steps
- [ ] **Code Blocks:** 
  - [ ] Diagnostic commands included
  - [ ] Expected output shown
- [ ] **Admonitions:** Used appropriately for warnings and notes

---

## Required Sections Reference

Every Troubleshooting Guide should include:

1. **Title** (Describes the problem or error)
2. **Summary** (Who + What problems resolved)
3. **Problem-Solution Sections** (Each with Symptoms, Cause, Solution)
4. **Diagnostic Tools** (if applicable)
5. **Common Questions** (FAQ-style, if applicable)
6. **Support Information** (How to get additional help)
7. **Related Documentation** (Links to setup, specifications, etc.)

---

## Example: Complete Troubleshooting Structure

Here's how a complete troubleshooting guide should look:

```markdown
---
myst:
  html_meta:
    product-name: TT-QuietBox
    technology-concepts: troubleshooting, BIOS, PCIe, coolant, maintenance
    document-type: Troubleshooting
---

# Troubleshooting Common Hardware Issues

This guide assists users in diagnosing and resolving common hardware issues with the TT-QuietBox™ system, including system instability, boot failures, and long-term maintenance tasks such as coolant refilling.

## Resolving System Instability or Random Reboots After a BIOS Change

If your system experiences random reboots or stability issues after a BIOS update or reset, a specific setting may be incorrectly configured.

**Symptoms:**
* Random system reboots
* System instability
* Issues occur after BIOS update or reset

**Cause:** The PCIe Advanced Error Reporting (AER) mechanism is not configured to allow the operating system to handle error reporting. This misconfiguration can interfere with Tenstorrent's system management software.

**Solution:** Set the reporting mechanism to **OS First**.

1. Enter the system **BIOS** during boot.
2. Navigate to **Advanced** \> **AMD CBS** \> **NBIO Common Options** \> **NBIO RAS Common Options**.
3. Locate the setting for **PCIe AER Reporting Mechanism**.
4. Change the value to **OS First**.
5. Save changes and exit the **BIOS**.

---

## Resolving Boot Failures or Undetected Cards

If your system does not boot, or if Tenstorrent hardware does not appear in software utilities such as `tt-smi`, the PCIe cards may be unseated.

:::{note}
Extended boot times are normal during the first boot or after a power loss event. System memory training can take up to 10 minutes to complete. This behavior does not indicate a boot failure.
:::

**Symptoms:**
* System does not boot
* Hardware not detected in `tt-smi`
* POST codes indicating hardware issues

**Cause:** One or more PCIe cards may have become loose during shipment or relocation.

**Solution:** Reseat the PCIe cards manually.

:::{warning}
This procedure requires technical expertise and careful handling to avoid damaging system components. Proceed with caution.
:::

### Required Tools

* 2.5mm security hex bit
* 2.0mm security hex bit
* Phillips head screwdriver

### Reseating Procedure

1. Place the system on its side. Use a 2.5mm security hex bit to unscrew the chassis top panel and access the PCIe cards.
   
   ![](qb_1_1.jpg)

2. Carefully remove the front glass panel and set it aside in a safe location.
   
   ![](qb_1_2.png)

3. [Continue with remaining steps...]

**Verification:**
```bash
$ tt-smi
```

You should see all cards listed in the output.

**If this does not resolve the issue:**
[Raise a support request](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) with details about your system configuration.

---

## Common Questions

### How do I choose between different product variants?

[Clear answer with specific recommendations]

### Which cables should I purchase?

[Answer with validated options and links if applicable]
```

---

## Writing Tips

### Problem Descriptions

**Do:**
* Start with clear symptom description
* Use specific error messages when available
* Include context about when the problem occurs
* List all relevant symptoms

**Do Not:**
* Use vague descriptions: "system not working"
* Assume the user knows technical terms without explanation
* Skip symptom descriptions

### Solution Steps

**Do:**
* Number steps sequentially
* Be specific: "Navigate to Advanced > AMD CBS" not "go to BIOS settings"
* Include verification steps
* Show expected output

**Do Not:**
* Combine multiple actions in one step
* Skip verification
* Assume prior knowledge

### Cause Explanations

**Do:**
* Explain the root cause clearly
* Use technical accuracy
* Help users understand why the problem occurs

**Do Not:**
* Blame the user
* Use overly technical jargon without explanation
* Skip cause explanation

---

## Quality Assurance

Before submitting your troubleshooting guide, verify:

1. **Accuracy:**
   - [ ] All solutions tested and working
   - [ ] Diagnostic commands verified
   - [ ] Expected outputs accurate
   - [ ] Links functional

2. **Completeness:**
   - [ ] Common issues covered
   - [ ] Symptoms clearly described
   - [ ] Solutions provided for all listed problems
   - [ ] Support escalation path included

3. **Clarity:**
   - [ ] Symptoms easy to identify
   - [ ] Solutions actionable
   - [ ] Technical terms explained
   - [ ] Steps unambiguous

4. **Organization:**
   - [ ] Problems logically grouped
   - [ ] Most common issues first
   - [ ] Related problems grouped together

---

## Additional Resources

* [Sphinx Documentation](https://www.sphinx-doc.org/)
* [MyST Markdown Guide](https://mystmd.org/)

---

## Template Usage Notes

1. **Copy this template** to create your troubleshooting guide
2. **Replace all bracketed placeholders** with actual content
3. **Organize problems** by category or frequency
4. **Test all solutions** before documenting
5. **Include diagnostic commands** for verification
6. **Provide clear escalation paths** for unresolved issues

Remember: Troubleshooting guides should help users solve problems quickly. Clarity and accuracy are essential.

