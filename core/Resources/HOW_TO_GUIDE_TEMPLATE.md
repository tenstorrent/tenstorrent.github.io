# Task-Based Guide (How-To) Template

This template provides a structured rubric for creating Task-Based Guides (How-To's). Use this template as a starting point for all step-by-step instructional documentation.

---

## Template Structure

```markdown
---
myst:
  html_meta:
    product-name: Product Name, Alternative Name, Technology Name
    technology-concepts: Concept1, Concept2, Concept3, Concept4
    document-type: Task-Based Guide (How-To)
---

# [Gerund Verb] the [Product/Feature Name]

[One-to-three sentence summary that answers:]
- Who is this for?
- What will they learn or be able to do?

Example: "This guide provides system administrators, hardware engineers, and users responsible for the initial setup of Tenstorrent hardware with step-by-step instructions. You will learn to safely unbox a TT-QuietBox Blackhole™ workstation, connect all required hardware components, and install the recommended operating system."

## Before You Begin

[Context-setting paragraph that prepares the user for the task. Include:]
- Physical space requirements
- Safety considerations
- Time estimates (if applicable)
- Any preliminary steps or decisions needed

### Prerequisites

[Clear list of what the user must have or know before starting:]

**Required Knowledge:**
* Basic understanding of [topic/concept]
* Familiarity with [tool/system]

**Required Hardware:**
* [Hardware item 1]
* [Hardware item 2]

**Required Software:**
* [Software/version]
* [Tool/version]

**Required Access:**
* [Permissions, accounts, or access needed]

### Required Tools and Equipment

[Physical tools, software tools, or resources needed:]

* [Tool 1] - [Purpose]
* [Tool 2] - [Purpose]

### Safety Warnings

[Include any safety considerations. Link to detailed safety information if available.]

:::{warning}
[Critical safety information that must not be missed. Be specific about risks and consequences.]
:::

[Optional: Link to detailed safety documentation]
For detailed safety information, see [Safety Warnings](specifications.md#safety-warnings).

---

## Step 1: [Descriptive Action Name]

[Brief introduction to what this step accomplishes.]

Follow these steps to [accomplish the goal]:

1. **Action description.** [Detailed instruction with specific details.]
   
   [Optional: Include image with descriptive alt text]
   ![](image_filename.png)
   
   [Optional: Include note or tip]
   :::{note}
   [Supplementary information that may be helpful.]
   :::

2. **Action description.** [Detailed instruction.]
   
   [Optional: Include code block for commands]
   ```bash
   $ command --option value
   ```
   
   [Expected output or result]
   ```
   Expected output here
   ```

3. **Action description.** [Continue with numbered steps.]

[Optional: Verification step]
**Verify the result:** [How to confirm this step completed successfully]

---

## Step 2: [Descriptive Action Name]

[Brief introduction to what this step accomplishes.]

[Continue with numbered steps following the same pattern as Step 1.]

---

## Step 3: [Descriptive Action Name]

[Continue pattern for all steps.]

---

## Verification and Testing

[Section for verifying the entire process completed successfully:]

1. **Verification step 1:** [How to verify]
   ```bash
   $ verification-command
   ```
   
   [Expected output]
   ```
   Expected verification output
   ```

2. **Verification step 2:** [Additional verification]

:::{important}
[Critical information about what success looks like or what to do if verification fails.]
:::

---

## Troubleshooting

[Common issues and solutions:]

### Issue: [Problem Description]

**Symptoms:**
* [Symptom 1]
* [Symptom 2]

**Solution:**
[Step-by-step resolution]

**If this does not resolve the issue:**
[Link to support or additional resources]

---

## Next Steps

[What the user should do after completing this guide:]

* [Next action or guide to follow]
* [Related documentation]
* [Additional resources]

---

## Need Additional Support?

If you encounter any issues, or have a question that is not covered in the documentation, please [raise a support request.](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) Our team will review your request and provide assistance.

---

## Related Documentation

* [Related guide 1](link-to-guide.md)
* [Related guide 2](link-to-guide.md)
* [Reference documentation](link-to-reference.md)
```

---

## Quality Checklist

Use this checklist to ensure your guide meets documentation standards:

### Document Structure

- [ ] **Title:** Starts with a gerund (verb ending in "-ing")
  - ✅ Correct: "Installing the Tenstorrent Software Stack"
  - ❌ Incorrect: "Install the Tenstorrent Software Stack"

- [ ] **Summary:** One-to-three sentences answering:
  - [ ] Who is this for?
  - [ ] What will they learn or be able to do?

- [ ] **Metadata:** Complete myst frontmatter with:
  - [ ] Product names (comma-separated, all variations)
  - [ ] Technology concepts (comma-separated, relevant keywords)
  - [ ] Document type: "Task-Based Guide (How-To)"

### Content Quality

- [ ] **Voice:** Writing is:
  - [ ] Honest (transparent about complexity and limitations)
  - [ ] Sharp (precise, quantitative data)
  - [ ] Human (active voice, direct address)
  - [ ] Concise (no unnecessary words)

- [ ] **Prohibited Language:** Avoided:
  - [ ] "Dynamic," "Ultimate," "Exceptional"
  - [ ] "Leading Edge," "Cutting Edge"
  - [ ] "Powerful," "High Impact"
  - [ ] "Revolution," "Disrupt"
  - [ ] "Limitless," "Maximum"

- [ ] **Grammar:**
  - [ ] No contractions (use "do not" not "don't")
  - [ ] Acronyms spelled out on first use with acronym in parentheses
  - [ ] Product names capitalized correctly with trademark symbols (™)

### Formatting

- [ ] **Headings:** Sequential hierarchy (H2 → H3 → H4, no skipping)
- [ ] **Lists:** 
  - [ ] Numbered lists for sequential steps
  - [ ] Bulleted lists for unordered items
- [ ] **Emphasis:**
  - [ ] **Bold** for UI elements and user input
  - [ ] *Italics* for conceptual emphasis and file paths
- [ ] **Code:**
  - [ ] Code blocks with language specified
  - [ ] Commands prefixed with `$` prompt
  - [ ] Inline code with backticks for technical terms
- [ ] **Admonitions:** Used appropriately:
  - [ ] `:::{note}` for supplementary information
  - [ ] `:::{important}` for critical information
  - [ ] `:::{warning}` for safety concerns or risks
  - [ ] `:::{admonition} Important :class: danger` for critical failures

### Media

- [ ] **Images:**
  - [ ] Only when essential (not for text or code)
  - [ ] Descriptive alt text provided
  - [ ] Consistent OS/theme if screenshots
  - [ ] Annotations use brand colors (Black #202020, Tens Purple #7C68FA)

- [ ] **Tables:**
  - [ ] Headers with Black background (#202020), White text (#FFFFFF)
  - [ ] Clear, structured data

### Accessibility

- [ ] **Alt Text:** Every meaningful image has descriptive alt text
- [ ] **Links:** Link text clearly describes destination (not "click here")
- [ ] **Color:** Not used as sole information carrier (accompanied by text/icons)

---

## Required Sections Reference

Every Task-Based Guide must include:

1. **Title** (Gerund form)
2. **Summary** (Who + What they'll learn)
3. **Before You Begin** (Context and preparation)
4. **Prerequisites** (Knowledge, hardware, software, access)
5. **Required Tools and Equipment**
6. **Safety Warnings** (if applicable)
7. **Step-by-Step Instructions** (Numbered, clear actions)
8. **Verification** (How to confirm success)
9. **Troubleshooting** (Common issues and solutions)
10. **Next Steps** (What to do after completion)
11. **Support Information** (How to get help)

---

## Example: Complete Guide Structure

Here's how a complete guide should look:

```markdown
---
myst:
  html_meta:
    product-name: TT-QuietBox Blackhole™, Blackhole™ Networked AI Processor, Tensix core
    technology-concepts: PCIe, QSFP-DD, Installation, Setup, Electrostatic Discharge (ESD), Basic Input/Output System (BIOS)
    document-type: Task-Based Guide (How-To)
---

# Receiving, Unboxing, and Setup

This guide provides system administrators, hardware engineers, and users responsible for the initial setup of Tenstorrent hardware with step-by-step instructions. You will learn to safely unbox a TT-QuietBox Blackhole™ workstation, connect all required hardware components, and install the recommended operating system.

## Before You Begin

Before you begin, choose a clear, stable, and spacious area for the TT-QuietBox Blackhole™ workstation. The system ships in a palletized wooden crate. Ensure you have at least two people and enough room for them to maneuver comfortably and safely around the crate and system.

### Prerequisites

**Required Knowledge:**
* Basic understanding of computer hardware assembly
* Familiarity with Linux command line (for verification steps)

**Required Hardware:**
* Keyboard (user-provided)
* Mouse (user-provided)
* Monitor (user-provided)
* Ethernet cable, Cat 6 or better (user-provided)

**Required Software:**
* None (operating system pre-installed)

### Required Tools and Equipment

For unboxing, you will need the following tools:

* Phillips head screwdriver
* Scissors or similar cutting tool

### Safety Warnings

:::{warning}
The fully palletized and crated shipment weighs approximately 134 lbs (61 kg), and the workstation itself weighs approximately 80 lbs (36 kg). Unboxing and lifting require at least two people for safe maneuverability.

Do not proceed with unboxing or installation if you suspect shipping damage to the system. Contact Tenstorrent support by [raising a support request.](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1)
:::

For detailed safety information, see [Safety Warnings](specifications.md#safety-warnings).

---

## Step 1: Unboxing the Workstation

Follow these steps to unbox your TT-QuietBox Blackhole™ workstation:

1. **Position the crate.** Position the crate in your prepared unboxing area, ensuring ample space for two people to work around it.
   
   ![](qb_setup_1.jpg)

2. **Remove plastic wrap.** Remove the outer plastic wrap and cut the two lifting straps looped around the crate.
   
   ![](qb_setup_2.jpg)

[Continue with remaining steps...]

---

## Verification and Testing

Verify that all four accelerators are recognized by the system:

```bash
$ sudo update-pciids
$ lspci -d 1e52:
```

You should see an output listing four recognized accelerators:
```
01:00.0 Processing accelerators: Tenstorrent Inc Blackhole
41:00.0 Processing accelerators: Tenstorrent Inc Blackhole
42:00.0 Processing accelerators: Tenstorrent Inc Blackhole
c1:00.0 Processing accelerators: Tenstorrent Inc Blackhole
```

:::{important}
If you do not see all four accelerators listed, please [raise a support request.](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) Our team will review your request and provide assistance.
:::

---

## Troubleshooting

### Issue: System Does Not Power On

**Symptoms:**
* Power button does not respond
* No LED indicators visible
* No fan noise

**Solution:**
1. Verify the power supply switch on the rear panel is set to **ON**.
2. Check that the power cable is securely connected to both the workstation and the power outlet.
3. Test the power outlet with another device to confirm it is functioning.

**If this does not resolve the issue:**
[Raise a support request](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) with details about your power supply configuration.

---

## Next Steps

After completing this setup guide:

* [Installing the Tenstorrent Software Stack](../../../getting-started/README.md)
* [Running Model Demos](../../../getting-started/model-demos.md)
* Review the [Technical Specifications](specifications.md) for detailed system information

---

## Need Additional Support?

If you encounter any issues, or have a question that is not covered in the documentation, please [raise a support request.](https://tenstorrent.atlassian.net/servicedesk/customer/portal/1) Our team will review your request and provide assistance.

---

## Related Documentation

* [Technical Specifications](specifications.md)
* [Troubleshooting Common Hardware Issues](../common/support.md)
* [Tenstorrent Software Stack Installation](../../../getting-started/README.md)
```

---

## Writing Tips

### Step Descriptions

**Do:**
* Start each step with a bold action verb: "**Connect** the power cable..."
* Be specific: "Connect the C13 power cable to the rear panel power input port"
* Include verification: "You should hear an audible click when the cable is properly seated"

**Do Not:**
* Use vague language: "Set up the system" (too vague)
* Assume knowledge: "Connect it like normal" (what is "normal"?)
* Skip verification: Always tell users how to confirm a step worked

### Code Blocks

**Format:**
```bash
$ command --option value
```

**Include:**
* Expected output when relevant
* Error messages users might see
* Explanations of what each command does

### Images

**When to Use:**
* Showing physical connections or hardware locations
* Demonstrating UI elements that are hard to describe
* Illustrating complex topologies or relationships

**When Not to Use:**
* Screenshots of terminal output (use code blocks instead)
* Images of text that could be written
* Decorative images without purpose

### Admonitions

**Use Warning for:**
* Safety hazards
* Potential data loss
* Irreversible actions
* System damage risks

**Use Important for:**
* Critical information that must not be missed
* Success criteria
* Required follow-up actions

**Use Note for:**
* Helpful tips
* Optional information
* Context or background

---

## Quality Assurance

Before submitting your guide, verify:

1. **Completeness:**
   - [ ] All required sections present
   - [ ] Every step has clear instructions
   - [ ] Verification steps included
   - [ ] Troubleshooting covers common issues

2. **Accuracy:**
   - [ ] All commands tested and working
   - [ ] File paths verified
   - [ ] Links tested and functional
   - [ ] Product names and versions correct

3. **Clarity:**
   - [ ] No ambiguous instructions
   - [ ] Technical terms defined on first use
   - [ ] Prerequisites clearly stated
   - [ ] Expected outcomes described

4. **Writing Standards:**
   - [ ] Clear, concise language
   - [ ] Proper capitalization and trademarks
   - [ ] No contractions
   - [ ] Active voice throughout

5. **Accessibility:**
   - [ ] All images have alt text
   - [ ] Links have descriptive text
   - [ ] Color not used as sole information carrier
   - [ ] Tables properly formatted

---

## Additional Resources

* [Sphinx Documentation](https://www.sphinx-doc.org/)
* [MyST Markdown Guide](https://mystmd.org/)

---

## Template Usage Notes

1. **Copy this template** to create your guide
2. **Replace all bracketed placeholders** with actual content
3. **Remove sections** that do not apply to your specific guide
4. **Add sections** as needed for your specific use case
5. **Follow the checklist** to ensure quality standards
6. **Test all commands and links** before finalizing

Remember: This template is a starting point. Adapt it to fit your specific documentation needs while maintaining quality and consistency standards.

