# Token Launch - Core Purpose Statement

**Created:** 1 January 2026  
**Plugin Version at Time of First Community Publication:** v1.3.1

## Core Purpose (Immutable After Publication)

Token Launch is a Figma plugin that:

1. **Extracts design tokens** from Figma documents (colours, typography, spacing, effects, variables)
2. **Delivers tokens to version control systems** via automated workflows (pull requests, commits) OR local file download
3. **Bridges design and development** by automating the design-to-code handoff for design systems

**Initial Implementation:** GitHub integration (v1.3.1)

**Target Users:** UI/UX designers, design system teams, product designers, design technologists

**Primary Use Case:** Automate design token delivery from Figma to development codebases

## Core Principles (What Makes Token Launch "Token Launch")

These define the plugin's identity:

1. **Token-Focused:** Primary function is extracting and delivering design tokens
2. **Version Control Integration:** Tokens go to Git-based systems (GitHub, GitLab, Bitbucket, etc.)
3. **Automation-First:** Reduces manual handoff work
4. **Designer-Friendly:** No technical knowledge required
5. **Development-Ready Output:** Tokens delivered in formats developers can use

## Acceptable Future Features (Consistent with Core Purpose)

These features would be ALLOWED because they enhance the core purpose:

### Git Platform Expansion ✅
- ✅ GitLab support
- ✅ Bitbucket support  
- ✅ Azure DevOps support
- ✅ Any Git-based version control system
- ✅ Self-hosted Git servers (GitHub Enterprise, GitLab self-hosted, etc.)

### Token Capabilities ✅
- ✅ Token transformation (JSON → CSS/SCSS/Swift/Kotlin)
- ✅ CI/CD integration (trigger workflows after token push)
- ✅ Incremental updates (delta sync)
- ✅ Token validation
- ✅ Collection-level management
- ✅ Additional export formats

### Workflow Enhancements ✅
- ✅ Multiple repository support (push to many repos at once)
- ✅ Branch management
- ✅ Merge conflict resolution
- ✅ Export history and rollback
- ✅ Notifications (Slack, email, etc. about successful pushes)

### Quality Improvements ✅
- ✅ Performance improvements
- ✅ Better error handling
- ✅ Improved UI/UX
- ✅ Accessibility enhancements

## Unacceptable Changes (Would Violate "No Pivot" Rule)

These would be PROHIBITED because they fundamentally change the purpose:

### Removing Core Functionality ❌
- ❌ Removing token extraction entirely
- ❌ Removing ALL version control integration (leaving only file download)
- ❌ Removing ALL export methods (no way to get tokens out)

### Changing Primary Purpose ❌
- ❌ Making it primarily a prototyping tool
- ❌ Making it primarily an analytics tool
- ❌ Making it primarily an asset manager
- ❌ Making it primarily a component library
- ❌ Making it primarily anything other than "design token delivery"

### Mandatory Platform Lock-In ❌
- ❌ Removing GitHub support and making GitLab the ONLY option (without advance notice to users)
- ❌ Removing all local download options (forcing cloud dependency)

**Important:** Adding new platforms is fine. Removing existing platforms requires:
1. Advance notice to users (30+ days)
2. Migration path provided
3. Clear communication why

## Test: "Is This Change Allowed?"

Ask yourself these questions:

### Question 1: Does this help export design tokens from Figma?
- **YES** = Likely allowed
- **NO** = Likely not allowed

### Question 2: Does this help deliver tokens to development?
- **YES** = Likely allowed
- **NO** = Likely not allowed

### Question 3: After this change, would users still describe Token Launch as "design token export tool"?
- **YES** = Allowed
- **NO** = Not allowed (it's a pivot)

### Question 4: Does this fundamentally make Token Launch a different TYPE of tool?
- **NO** = Allowed
- **YES** = Not allowed (create new plugin instead)

## Specific Examples

### ✅ ALLOWED: GitLab Support
**Scenario:** "I want to add GitLab integration alongside GitHub"

**Analysis:**
- Still delivering tokens to version control? YES
- Still serving same user need? YES
- Same type of tool? YES
- Core purpose changed? NO

**Decision:** ✅ **ALLOWED** - This is expansion, not pivot

---

### ✅ ALLOWED: Bitbucket + Azure DevOps
**Scenario:** "I want to support Bitbucket and Azure DevOps in addition to GitHub"

**Analysis:**
- Still version control integration? YES
- Users still get what they expected? YES (+ more options)
- Core functionality intact? YES

**Decision:** ✅ **ALLOWED** - More options for same purpose

---

### ✅ ALLOWED: Removing GitHub (with conditions)
**Scenario:** "GitHub changed their API and I can't support it anymore. I want to remove GitHub but keep GitLab and Bitbucket"

**Analysis:**
- Core purpose (version control delivery) maintained? YES
- Users still get tokens to Git? YES
- Reasonable technical reason? YES

**Conditions Required:**
- 30-day advance notice to users
- Migration