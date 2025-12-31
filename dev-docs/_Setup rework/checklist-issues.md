🟡 Issue 3: 
Setup Tab 
- third accordion "File Paths & Settings: 
      - change name to : File Paths & Commit Settings (Optional)
      - eliminate "commit message" element alltogether from here.
      - Label "Raw Tokens Path" should be changed to "Token File Location"; the helper text underneath the input should read "Where your token files will be saved in the repository"
      - the placeholder and default should be /tokens
- Second accordion: Repoository Configuration
    - error "Repository not found or you don't have access to it." --> change to "
    ````
      ❌ Repository not found or you don't have access to it.

      Common fixes:
      - Check the repository owner and name are correct
      - Verify your GitHub token has 'repo' scope
      - Ensure the repository isn't private (or use 'repo' 
        scope instead of 'public_repo')

      [Validate Again]
      ````

    - branch input field
       - once the owner and name has been validated; instead of an input field, it's a dropdown with the branches that already exist in that repo... always main by default --> basically it's the same branch dropdown as the one in the Push Screen. Use the same one, but keep the validation logic we have now
       - if this is not clear, ask questions about it before working on it.

       - change bottom helper text to read: 
       ````
       The branch where tokens will be pushed

      ⚠️ Tip: Most teams use 'main' or 'master'. Don't 
      know? Check your repository on GitHub.
      ```

- First accordion: 
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

- Setup actions should be sticky at the bottom of the winndow; always visible when scrolling like a sticky footer



***potential add a banner at the top when complete setup is validated (before the automatic taking you to Export tab)

