# 📋 Problem Tracking Form

A modern, user-friendly web form for reporting and tracking production issues in manufacturing environments.

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How to Use](#how-to-use)
- [Form Fields](#form-fields)
- [Smart Features](#smart-features)
- [File Structure](#file-structure)
- [Technical Details](#technical-details)
- [Customization](#customization)

---

## 🎯 Overview

The Problem Tracking Form is a single-page web application designed to streamline the process of reporting production issues. It features automatic field detection, learning autocomplete, and a clean dark mode interface.

---

## ✨ Features

### Core Features
- **Auto-fill**: Automatically detects week number, current shift, date, and time
- **Learning Autocomplete**: Descriptions and corrective actions learn from your inputs
- **Quick Templates**: Frequently used issues appear as one-click templates
- **File Attachments**: Upload images, PDFs, and documents as evidence
- **Progress Tracking**: Visual indicator shows form completion status
- **Dark Mode**: Eye-friendly dark interface (enabled by default)

### Smart Automation
- Week number calculated automatically based on current date
- Shift detected based on time of day:
  - **Day shift**: 7:00 AM - 3:00 PM
  - **Middle shift**: 3:00 PM - 11:00 PM
  - **Night shift**: 11:00 PM - 7:00 AM
- Issue time options adjust based on selected shift
- Dates default to today's date

### Data Persistence
- Remembers your preferred Line and Owner selections
- Stores description history for quick autocomplete
- Saves corrective action patterns
- Learns from submissions to build quick templates

---

## 📝 How to Use

### Step 1: Basic Information
1. **Week**: Auto-selected based on current week (1-16)
2. **Shift**: Auto-detected based on current time
3. **Line**: Select the production line (or "ALL" for general issues)
4. **Model**: Choose the product model affected
5. **Station**: Select the workstation where the issue occurred
6. **Category**: Choose the responsible team

### Step 2: Issue Details
1. **Issue Time**: Pre-filled with current time, adjust if needed
2. **Date Detection**: Auto-filled with today's date
3. **Description**: Type the issue description (autocomplete shows previous entries)

### Step 3: Resolution (Optional - Collapsible)
Click on "Resolution & Status" to expand this section:
1. **Status**: Set to "Done" by default
2. **Owner**: Select the person responsible
3. **Corrective Action**: Document what was done to fix the issue
4. **Date Finished**: Auto-filled with today's date
5. **Evidence**: Add links or attach files
6. **Comments**: Any additional notes

### Step 4: Submit
Click the "✓ Submit Report" button to send the data.

---

## 📊 Form Fields Reference

| Field | Required | Auto-filled | Description |
|-------|----------|-------------|-------------|
| Week | ✅ | ✅ | Week number (1-16) |
| Shift | ✅ | ✅ | Day/Middle/Night |
| Line | ✅ | ❌ | Production line |
| Model | ✅ | ❌ | Product model |
| Station | ✅ | ❌ | Workstation |
| Category | ✅ | ❌ | Responsible team |
| Issue Time | ✅ | ✅ | Time of issue |
| Date Detection | ❌ | ✅ | When issue was found |
| Description | ❌ | ❌ | Issue description |
| Status | ❌ | ✅ | Current status |
| Owner | ❌ | ❌ | Responsible person |
| Corrective Action | ❌ | ❌ | Fix applied |
| Date Finished | ✅ | ✅ | Resolution date |
| Evidence | ❌ | ❌ | Links/references |
| Files | ❌ | ❌ | Attached documents |
| Comments | ❌ | ❌ | Additional notes |

---

## 🧠 Smart Features

### Quick Templates
- Templates appear automatically based on your submission history
- Most frequently used issues appear first
- Click any template to auto-fill Category, Description, and Corrective Action

### Learning Autocomplete
- As you type descriptions, previous entries appear as suggestions
- Same for corrective actions
- History is stored locally and persists across sessions

### Remember Preferences
- Enable "Remember my Line & Owner for next time" checkbox
- Your selections will be pre-filled on next visit

---

## 📁 File Structure

```
trakikng/
├── index.html          # Main HTML structure
├── styles.css          # All CSS styles (dark mode)
├── app.js              # JavaScript functionality
├── README.md           # This documentation
└── index_backup.html   # Backup of original file
```

---

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup with datalists for autocomplete
- **CSS3**: Flexbox, Grid, gradients, animations
- **Vanilla JavaScript**: No frameworks required
- **localStorage**: For client-side data persistence
- **Google Apps Script**: Backend for form submission

### Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

### Data Storage
All user preferences and history are stored locally in the browser using localStorage:
- `problemTracking_descriptions`: Previous descriptions
- `problemTracking_actions`: Previous corrective actions
- `problemTracking_templates`: Quick template data
- `problemTracking_preferences`: Saved Line/Owner selections

---

## 🎨 Customization

### Adding New Options

**Lines**: Edit `index.html`, find the `<select name="line">` element and add new `<option>` tags.

**Models**: Edit `index.html`, find the `<datalist id="models">` and add new `<option>` tags.

**Stations**: Edit `index.html`, find the `<datalist id="stations">` and add new `<option>` tags.

**Owners**: Edit `index.html`, find the `<select id="owner-select">` and add new `<option>` tags.

### Changing Colors
Edit `styles.css` to modify the color scheme. Key color variables:
- Background: `#1a1a2e`, `#16213e`
- Accent: `#8b5cf6`, `#a855f7`
- Text: `#e0e0e0`, `#b0b0b0`

### Modifying Shift Times
Edit `app.js`, find the `autoDetectShift()` function to change shift hour ranges.

---

## 📧 Support & Feedback

Use the feedback form at the bottom of the page to suggest improvements or report issues with the form itself.

---

## 📜 Version History

- **v1.0**: Initial form with basic fields
- **v2.0**: Added auto-fill features, learning autocomplete
- **v3.0**: Added file uploads, progress bar, templates
- **v4.0**: Code separation, dark mode, help section

---

*Last updated: January 2026*
