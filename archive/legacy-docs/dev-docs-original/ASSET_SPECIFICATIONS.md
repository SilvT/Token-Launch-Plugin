# Visual Asset Specifications

Create these assets for Figma marketplace submission.

---

## 1. Plugin Icon

### Specifications
- **Filename:** `icon-128.png`
- **Dimensions:** 128 × 128 pixels
- **Format:** PNG-24 with transparency
- **Color Mode:** RGB
- **Background:** Transparent

### Design Guidelines
**Theme:** Design tokens + distribution
**Style:** Modern, clean, professional
**Colors:** Purple/pink gradient (from plugin theme)

**Color Palette:**
```
Primary Purple: #510081
Pink Accent:    #f9a8d4
Light Purple:   #e0d0ff
Background:     #f5f0ff (if solid background needed)
```

### Design Options

**Option A: Token Symbol**
```
┌──────────────┐
│              │
│   🎨         │
│   Gradient   │
│   Circle     │
│              │
└──────────────┘
```
- Center: Token/palette icon (🎨)
- Background: Purple-to-pink gradient
- Shadow: Subtle drop shadow for depth

**Option B: Abstract Tokens**
```
┌──────────────┐
│    ●  ●  ●   │
│   ●  ●  ●    │
│  ●  ●  ●     │
│   Flow →     │
└──────────────┘
```
- Circles representing tokens
- Flowing/distributing pattern
- Gradient colors

**Option C: System Icon**
```
┌──────────────┐
│  ┌──┐ ┌──┐   │
│  │  │ │  │   │
│  └──┘ └──┘   │
│    →  →      │
└──────────────┘
```
- Geometric representation of design system
- Distribution arrows
- Minimal, professional

### Figma Frame Setup
```
Frame Name: Plugin Icon
Width: 128px
Height: 128px
Background: Transparent
Export: PNG @ 1x
```

---

## 2. Cover Image

### Specifications
- **Filename:** `cover-1920x960.png`
- **Dimensions:** 1920 × 960 pixels
- **Format:** PNG-24
- **Color Mode:** RGB
- **Background:** Gradient or solid color

### Layout Template
```
┌────────────────────────────────────────────────────────┐
│                         Top 200px                      │
│                                                        │
│           Design System Distributor                    │
│           (Large, bold, 48-72px)                       │
│                                                        │
├────────────────────────────────────────────────────────┤
│                       Middle 160px                     │
│                                                        │
│    Extract design tokens from Figma and push them     │
│    to GitHub—automatically.                            │
│    (Medium, 24-32px)                                   │
│                                                        │
├────────────────────────────────────────────────────────┤
│                       Bottom 600px                     │
│                                                        │
│         [Plugin Screenshot or Workflow Visual]         │
│                                                        │
│                                                        │
│                                                        │
│                                                        │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Content Details

**Title:** "Design System Distributor"
- Font: Sans-serif, bold (e.g., Inter, SF Pro)
- Size: 48-72px
- Color: `#510081` or white (depending on background)
- Alignment: Center

**Tagline:** "Extract design tokens from Figma and push them to GitHub—automatically."
- Font: Sans-serif, regular
- Size: 24-32px
- Color: `#510081` or slightly transparent white
- Alignment: Center

**Background:**
- Option A: Gradient from `#f9a8d4` to `#e0d0ff`
- Option B: Solid `#f5f0ff`
- Option C: White with gradient accent

**Visual Element Options:**

**Option A: Plugin Screenshot**
- Show the PR creation screen
- Include token counts and badges
- Highlight GitHub integration

**Option B: Workflow Diagram**
```
Figma File  →  Plugin  →  GitHub PR
   (icon)      (icon)       (icon)
```

**Option C: Token Visualization**
- Grid of colorful token circles
- Flowing/distributing pattern
- Abstract and eye-catching

### Figma Frame Setup
```
Frame Name: Cover Image
Width: 1920px
Height: 960px
Background: Gradient or solid
Export: PNG @ 1x
```

---

## 3. Screenshots

### Specifications
- **Quantity:** Minimum 3, recommended 5
- **Format:** PNG
- **Color Mode:** RGB
- **Quality:** High resolution, no compression artifacts
- **Naming:** Descriptive (e.g., `screenshot-01-extraction.png`)

### Screenshot Plan

#### Screenshot 1: Token Extraction Success
**File:** `screenshot-01-extraction.png`
**Shows:**
- Success message with checkmark
- Token summary (45 tokens, 12.3 KB)
- Collection badges (colors, typography, etc.)
- Export choice buttons

**Caption for marketplace:**
"Comprehensive token extraction with real-time counts and collection badges"

**How to capture:**
1. Launch plugin in Figma
2. Extract tokens from a sample file
3. Capture the success screen
4. Ensure all UI elements are visible

---

#### Screenshot 2: GitHub PR Creation
**File:** `screenshot-02-github-pr.png`
**Shows:**
- Smart branch dropdown
- Existing branches listed
- Token statistics in sidebar
- PR title and message fields
- "Create Pull Request" button

**Caption for marketplace:**
"Seamless GitHub integration with smart branch selection and PR creation"

**How to capture:**
1. Navigate to PR creation screen
2. Show branch dropdown expanded
3. Include token counts visible
4. Capture before clicking "Create"

---

#### Screenshot 3: GitHub Setup
**File:** `screenshot-03-setup.png`
**Shows:**
- GitHub configuration form
- Token input field
- Repository and branch inputs
- Validation checkmarks (green)
- "Already Configured" status (if applicable)

**Caption for marketplace:**
"Secure credential management with real-time validation"

**How to capture:**
1. Open GitHub setup tab
2. Show completed/validated configuration
3. Ensure green checkmarks visible
4. Include security tooltips if visible

---

#### Screenshot 4 (Optional): Success State
**File:** `screenshot-04-success.png`
**Shows:**
- "PR Created Successfully!" message
- Clickable GitHub PR link
- Branch information
- Token/commit details

**Caption for marketplace:**
"Instant feedback with clickable links to view your PR on GitHub"

---

#### Screenshot 5 (Optional): Export Choice
**File:** `screenshot-05-export-choice.png`
**Shows:**
- Both export options (GitHub + Download)
- Token summary stats
- Visual hierarchy of choices

**Caption for marketplace:**
"Flexible export: GitHub PR or local JSON download"

---

### Screenshot Guidelines

**DO:**
- ✅ Use a real Figma file with actual tokens
- ✅ Ensure text is crisp and readable
- ✅ Show realistic data (not Lorem Ipsum)
- ✅ Capture at native resolution
- ✅ Include all important UI elements
- ✅ Make sure colors are accurate

**DON'T:**
- ❌ Use dummy or incomplete data
- ❌ Crop important UI elements
- ❌ Include personal/sensitive information
- ❌ Over-compress the images
- ❌ Use low resolution
- ❌ Show error states (unless demonstrating recovery)

### Capture Tools

**macOS:**
- Cmd+Shift+4 (select area)
- Cmd+Shift+4 then Space (capture window)
- Preview app for minor edits

**Windows:**
- Snipping Tool
- Win+Shift+S (snip & sketch)
- Paint/GIMP for edits

**Figma Plugin:**
- Use Figma's screenshot feature
- Ensure proper zoom level
- Export at 1x or 2x

---

## 4. File Organization

### Directory Structure
```
assets/
├── ASSET_SPECIFICATIONS.md (this file)
├── icon-128.png
├── cover-1920x960.png
├── screenshots/
│   ├── screenshot-01-extraction.png
│   ├── screenshot-02-github-pr.png
│   ├── screenshot-03-setup.png
│   ├── screenshot-04-success.png (optional)
│   └── screenshot-05-export-choice.png (optional)
└── source/ (optional - Figma files, PSDs, etc.)
    ├── icon-source.fig
    └── cover-source.fig
```

---

## 5. Quality Checklist

### Before Export
- [ ] All designs match plugin theme
- [ ] Colors are correct (#510081, #f9a8d4, etc.)
- [ ] Text is readable at target size
- [ ] No spelling errors
- [ ] Consistent style across all assets

### Icon Checklist
- [ ] 128×128 pixels exactly
- [ ] PNG with transparency
- [ ] Clear and recognizable at small size
- [ ] Matches plugin branding

### Cover Checklist
- [ ] 1920×960 pixels exactly
- [ ] Title and tagline visible
- [ ] Visual element is clear
- [ ] Professional appearance
- [ ] Represents plugin accurately

### Screenshot Checklist
- [ ] High resolution (no blurriness)
- [ ] All text readable
- [ ] UI elements complete
- [ ] No sensitive data visible
- [ ] Accurate representation of plugin

---

## 6. Export Settings

### From Figma
1. Select frame
2. Export settings (bottom right)
3. Format: PNG
4. Size: 1x (native size)
5. Export

### From Photoshop
1. File → Export → Export As
2. Format: PNG-24
3. Transparency: As needed
4. Quality: Maximum
5. Export

### From Sketch
1. Select artboard
2. Export (bottom right)
3. Format: PNG
4. Size: 1x
5. Export

---

## 7. Optimization

### File Size Guidelines
- Icon: < 100 KB
- Cover: < 500 KB
- Screenshots: < 300 KB each

### Optimization Tools
- **ImageOptim** (Mac) - Lossless compression
- **TinyPNG** (Web) - Lossy compression
- **Squoosh** (Web) - Browser-based

### Process
1. Create asset at target size
2. Export as PNG
3. Run through optimizer
4. Verify quality maintained
5. Check file size

---

## 8. Testing

### Visual Review
- [ ] View at actual size (100%)
- [ ] Check on light background
- [ ] Check on dark background
- [ ] Verify all text readable
- [ ] Confirm colors accurate

### Technical Verification
```bash
# Check image dimensions (macOS)
sips -g pixelWidth -g pixelHeight icon-128.png

# Check file size
ls -lh icon-128.png

# Check format
file icon-128.png
```

Expected output:
```
Icon:
  pixelWidth: 128
  pixelHeight: 128
  Size: < 100 KB
  Type: PNG image data

Cover:
  pixelWidth: 1920
  pixelHeight: 960
  Size: < 500 KB
  Type: PNG image data
```

---

## 9. Inspiration & Examples

### Figma Community
Browse published plugins for inspiration:
- https://www.figma.com/community/plugins
- Look for developer tools and design system plugins
- Note professional visual style

### Design Resources
- Figma Icon Component Library
- Unsplash for background inspiration
- Gradient generators (coolors.co, cssgradient.io)

---

## 10. Timeline

### Estimated Time
- **Icon Design:** 30-45 minutes
- **Cover Image:** 45-60 minutes
- **Screenshots:** 30 minutes (capture + edit)
- **Optimization:** 15 minutes
- **Total:** 2-3 hours

### Recommended Workflow
1. **Session 1 (60-90 min):** Design icon and cover in Figma
2. **Break:** Let designs rest, review with fresh eyes
3. **Session 2 (45-60 min):** Capture screenshots, refine designs
4. **Session 3 (15-30 min):** Export, optimize, verify quality

---

## Need Help?

**Design Questions:**
- Review existing Figma plugin icons for inspiration
- Use plugin's existing color palette
- Keep it simple and professional

**Technical Issues:**
- Check export dimensions carefully
- Use PNG format (not JPG)
- Optimize file sizes without quality loss

**Capture Issues:**
- Ensure Figma is at 100% zoom
- Use native screenshot tools
- Crop carefully to show complete UI

---

**Ready to create amazing assets!** 🎨

All specifications are here. Take your time, be creative, and make something you're proud of!
