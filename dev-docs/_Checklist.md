  Critical Blockers (Must Complete)

  - [ ]Create plugin icon (128×128px PNG)
  - [ ]Create cover image (1920×960px PNG)
  - [ ]Capture screenshots (3-5 images)


  Final Testing & Submission

  - [x]Manual testing in Figma desktop app
  - [ ]Verify plugin launches without console errors
  - [ ]Test all GitHub workflows end-to-end
  - [ ]Test error scenarios
  - [ ]Verify accessibility features
  - [ ]Prepare marketplace content (descriptions, tags)
  - [ ]Update documentation to v1.3.1
  - [ ]Package and submit to Figma marketplace

   UI/UX Tasks


  - [x]Tab styling enhancement
  - [!]Export options section with GitHub link
  - [x]Documentation split (user vs developer)
  - [x]CI/CD workflow tooltip
  - [ ]GitHub Actions tooltips
  - [x]Cancel navigation back to export screen
  - [x]Remove "duration" from landing page highlight numbers
  - [x]Remove left-behind emojis
  - [x]Change hover effect on landing page cards
  - [x]Update button styles (primary=black, secondary=outline, tertiary=brand)
  - [x]Update accordion icons to Phosphor icons
  - [x]Standardize button styles across system
  - [x]Change landing page card icons to black background
  - [x]Update "GitHub confirmed" box copy and styling
  - [x]Add lavender gradient hover on push screen action buttons
  - [ ]Fix loading screen consistency
  - [x]Invert gradient (pink bottom, purple top)
  - [x]Enlarge plugin window size
  - [ ] Modals aren't showing all the styles properly... check design system (cautious with theZ-index manipulation and pointer events)

  - on Trigger CI/CD checkbox
      - [x] Checkbox is not showing the design system styling (it's looking blue atm)
      - [x] Info hover for tooltip should show a primary-300 bg when hover and display a standard tooltip saying "click for more info" before opening the modal
      - [x] The text "File must exist in .githubt/workflows/ should be grey and smaller 
      - [ ] Add or change Link in Plugin Repo --> "Need help setting up CI/CD? View our GitHub Actions templates →"TBD - postponed to V1.1


  -  On "Pushed to Branch" success screen
      - [x]Instead of large Check icon, change for rocket on Mint 500 (or a higher value if it doesn't pass contrast check with gradient background colors)
      - [x] unify buttons styles with the design system
      - [x] Change message subtitle from "Your tokens have been commited!" to -> "Your Tokens are now ready to be consumed!"

  - For 1st submission to Figma's review (live-version-1) 
    - [x] I want to change the name of the plugin from "Design System Distributor" to "Figma Distributor"
    - [x] Disable the "Create pull request" option from the Push Screen. Give a grey cast over the button and text, hover styles change to a standard disable hover behaviour. When hover a tooltip (standard tooltip, not a modal one like the other we can find in the project) tells the user " Future Feature"

    - [x] Implement the logic: 
          IF "Push to Branch" is selected:
            Show: Single "Branch" dropdown
            - Populated with existing branches from repo
            - Default: "main" 
            - Option: "+ Create new branch" at bottom of dropdown
            - When "create new" selected, dropdown transforms to text input
          IF "Create Pull Request" is selected:
            Show: Two fields
            - "From Branch" (your feature branch) - text input with helper text
            - "To Branch" (base/target branch) - dropdown with existing branches
            - Default "To Branch": "main"

   - [x] Make Active state of Choose actions cards more "obvious" - bolder color on border + bg fill
        Selected card:
        - Purple border (3px)
        - Blush background tint (very subtle, like 5% opacity)
        - Small checkmark icon in top-right corner (?)
        - Slightly elevated (2px shadow)

  - [x] Make the "Need help?" card in the Export tab a collapsible accordion 

  - [x] I want the size of the window of the Push screen to always be the height of the windows
  -[x] Margins on Push screen equal to the ones on Landing page
 - [x] Commit message box full width

  ## Cleaning Tasks

  - [x] Clean and delete all console logs we aren't using or are deprecated
  - [x]Verify JSON file compatibility for Figma re-upload
  - [ ]Check plugin size and speed
  - [x]Compile and unify documentation
  - [ ]research if the window's top bar (X, name etc..) can be changed or styled
  - [ ] Error handling missing: validation checks before allowing the push? (e.g., checking if branch exists, if there are conflicts)
- [x] Change Name to Token Launch

---
---
🟡 Issue 3: 
Setup Tab 
- third accordion "File Paths & Settings: 
      - [x] Relocate this element from here to the Push Export Screen --> under "Branch" section
        
        Next:
          - [x] change name to : File Paths & Commit Settings (Optional)
          - [x] eliminate "commit message" element alltogether from here.
          - [x] Label "Raw Tokens Path" should be changed to "Token File Location"; the helper text underneath the input should read "Where your token files will be saved in the repository"
          - [x] the placeholder and default should be /tokens

- Second accordion: Repoository Configuration
    - [ ] error "Repository not found or you don't have access to it." --> change to "
    ```
      ❌ Repository not found or you don't have access to it.

      Common fixes:
      - Check the repository owner and name are correct
      - Verify your GitHub token has 'repo' scope
      - Ensure the repository isn't private (or use 'repo' 
        scope instead of 'public_repo')

      [Validate Again]
      ```

    - branch input field
       - [x] once the owner and name has been validated; instead of an input field, it's a dropdown with the branches that already exist in that repo... always main by default --> basically it's the same branch dropdown as the one in the Push Screen. Use the same one, but keep the validation logic we have now
       - [x] if this is not clear, ask questions about it before working on it.

       - [x] change bottom helper text to read: 
          ````
          The branch where tokens will be pushed

          ⚠️ Tip: Most teams use 'main' or 'master'. Don't 
          know? Check your repository on GitHub.
          ```

     - [x] small bug - when the credentials have been saved from before, the dropbox doesn't show... I need to reenter either repo name or owner so when the validation triggers again then the dropdown shows... Once it's been validated and nothing has changed on the inputs above, i want the dropdown to always show

- [x] First accordion: 
      current copy: 
      '''
      Create a token at GitHub Settings with 'repo' scope.
      Learn more
      '''

      change to --> 
      '''
      "Create a token at GitHub Settings with 'repo' scope.
      [Learn more] ← Keep this
      
      ⏱️ Takes ~2 minutes | 🔒 Your token never leaves Figma
      '''

- [x] Setup actions should be sticky at the bottom of the winndow; always visible when scrolling like a sticky footer
  - - [x] followup bug: force to always have scroll on Push screen, so the user can extend and navigate easily the commit message box with current setup, user can extend the box but then cannot see the end as it's under the sticky buttons



***potential add a banner at the top when complete setup is validated (before the automatic taking you to Export tab)






---
---

[x] ✅ Issue 4: Commit Message Needs Better Defaults
Current state: Default message is "Update design tokens from Figma"
Why it's not optimal:

Users pushing multiple times per day can't differentiate commits
No metadata about WHAT changed
Generic message doesn't follow Git best practices

Recommended solution:
Smart default commit message with timestamp:
Update design tokens from Figma - [YYYY-MM-DD HH:MM]

Changes:
- 2775 tokens
- 798 variables  
- 15 collections
Even better: Add collection names if they've changed:
Update design tokens from Figma - 2024-12-30 14:23

Updated collections:
- core (184 tokens)
- components (119 tokens)
- status-press (48 tokens)
Users can still edit this, but having a descriptive default is far more useful.



---
---



[ ]🟡 Issue 5: Add a validation layer before the "Push to Branch" button becomes enabled:

After user fills in branch name, show a loading spinner
Check if branch exists, check permissions
Show green checkmark ✓ next to branch field if valid
Only enable "Push to Branch" button when all validations pass

---
---

🟡 Issue 6: Trigger CI/CD checbox
1. In-plugin info button :
` ☐ Trigger CI/CD workflow after push (ℹ️)`
Clicking (ℹ️) shows tooltip:

```
Automatically runs GitHub Actions to transform 
your tokens into CSS, SCSS, iOS, Android formats.
   
Requires a workflow file in .github/workflows/
   
→ View setup guide
→ Download template
```
2. "View setup guide" links to:

- Short-term: GitHub repo README with step-by-step instructions
- Long-term: Simple landing page (figma-tokens.design/ci-cd-setup)

3. "Download template" provides:

- Starter .yml file with Style Dictionary config
- User downloads and places in .github/workflows/
- Plugin validates it exists before enabling CI/CD
