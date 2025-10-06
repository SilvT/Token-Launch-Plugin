# GitHub Integration for Figma Design System Distributor

This document outlines the GitHub API integration implementation for automatically pushing design tokens from Figma to GitHub repositories.

## 🏗️ Architecture Overview

The GitHub integration uses a **Personal Access Token (PAT)** authentication approach, which is ideal for Figma's plugin environment where traditional OAuth redirects aren't possible.

### Key Components

- **`GitHubClient`** - Core GitHub API client with error handling
- **`GitHubAuth`** - Authentication and credential management
- **`GitHubConfig`** - Configuration interface and validation
- **`SecureStorage`** - Encrypted credential storage within Figma
- **`GitHubIntegration`** - High-level integration with token extraction

## 🔐 Authentication & Security

### Personal Access Token Setup

1. **Generate Token**: Users visit [GitHub Personal Access Tokens](https://github.com/settings/personal-access-tokens/new)
2. **Required Scopes**:
   - `repo` - Full repository access for pushing files
3. **Token Storage**: Encrypted using XOR cipher within Figma's `clientStorage`

### Security Features

- ✅ **Encrypted Storage** - Tokens stored with basic encryption
- ✅ **Scope Validation** - Verifies token has required permissions
- ✅ **Connection Testing** - Validates credentials before operations
- ✅ **Error Handling** - Detailed error messages for debugging
- ✅ **Rate Limiting** - Respects GitHub API limits

## 🚀 Quick Start

### 1. Basic Setup

```typescript
import { GitHubIntegration } from './src/github/GitHubIntegration';
import { TokenExtractor } from './src/TokenExtractor';

// Initialize
const tokenExtractor = new TokenExtractor(config);
const github = new GitHubIntegration(tokenExtractor);
await github.initialize();

// Setup GitHub integration
const result = await github.setupGitHubIntegration({
  token: 'github_pat_your_token_here',
  repositoryUrl: 'your-org/design-tokens',
  branch: 'main'
});
```

### 2. Extract and Push Tokens

```typescript
// Complete workflow: Extract from Figma + Push to GitHub
const result = await github.extractAndPushTokens({
  commitMessage: 'Update design tokens from Figma'
});

if (result.success) {
  console.log(`✅ Pushed ${result.extractionResult.tokens.length} tokens to GitHub`);
}
```

### 3. Push Existing Tokens

```typescript
// Push pre-extracted tokens
const pushResult = await github.pushExistingTokens(
  existingTokenData,
  'Manual token update'
);
```

## 📁 Repository Structure

Tokens are pushed to a structured repository layout:

```
your-repo/
├── design-tokens/
│   ├── raw/
│   │   └── figma-export.json          # Raw plugin output
│   └── tokens/
│       ├── colors/                    # Processed by category
│       ├── typography/
│       └── spacing/
```

Default paths (configurable):
- **Raw tokens**: `design-tokens/raw/figma-export.json`
- **Processed tokens**: `design-tokens/tokens/`

## 🔧 Configuration Options

### GitHubConfig Interface

```typescript
interface GitHubConfig {
  credentials: {
    token: string;
    username?: string;
  };
  repository: {
    owner: string;
    name: string;
    branch?: string;          // Default: 'main'
  };
  paths: {
    rawTokens: string;        // Where to store raw exports
    processedTokens: string;  // Where to store processed tokens
  };
  commitMessage?: string;     // Template with {{timestamp}}
}
```

### Setup Examples

```typescript
// Minimal setup
await github.setupGitHubIntegration({
  token: 'github_pat_...',
  repositoryUrl: 'owner/repo'
});

// Advanced setup
await github.setupGitHubIntegration({
  token: 'github_pat_...',
  repositoryUrl: 'https://github.com/owner/repo',
  branch: 'tokens-update',
  paths: {
    rawTokens: 'figma/exports/tokens.json',
    processedTokens: 'src/tokens/'
  }
});
```

## 🔍 Connection Testing

### Test Connection

```typescript
const testResult = await github.testConnection();

if (testResult.success) {
  console.log(`✅ Connected as ${testResult.user.login}`);
  console.log(`📝 Can write: ${testResult.permissions.canWrite}`);
} else {
  console.error(`❌ Connection failed: ${testResult.error}`);
}
```

### Status Monitoring

```typescript
const status = await github.getConnectionStatus();

switch (status.status) {
  case 'connected':
    console.log('✅ Ready to push tokens');
    break;
  case 'invalid-token':
    console.log('❌ Token invalid, please update');
    break;
  case 'insufficient-permissions':
    console.log('❌ Token lacks repository permissions');
    break;
}
```

## 🛠️ Error Handling

### Common Error Scenarios

| Error Type | Cause | Solution |
|------------|-------|----------|
| `invalid-token` | Token expired/invalid | Generate new PAT |
| `repository-not-found` | Repo doesn't exist or no access | Check repo name and permissions |
| `insufficient-permissions` | Token lacks repo scope | Update token scopes |
| `rate-limit-exceeded` | Too many API calls | Wait and retry |

### Error Recovery

```typescript
const result = await github.extractAndPushTokens();

if (!result.success) {
  // Handle specific errors
  if (result.error?.includes('rate limit')) {
    // Wait and retry
    await new Promise(resolve => setTimeout(resolve, 60000));
    return github.extractAndPushTokens();
  }

  if (result.error?.includes('token')) {
    // Prompt for new token
    figma.notify('GitHub token expired. Please reconfigure.', { error: true });
  }
}
```

## 🎛️ Advanced Usage

### Repository Selection

```typescript
// List user's repositories
const repos = await github.listRepositories();

repos.repositories?.forEach(repo => {
  console.log(`${repo.fullName} - ${repo.canPush ? 'Writable' : 'Read-only'}`);
});
```

### Custom Commit Messages

```typescript
await github.extractAndPushTokens({
  commitMessage: `feat: update ${figma.root.name} tokens - v${version}`
});

// Template with timestamp
const template = 'Update design tokens from {{timestamp}}';
const message = GitHubConfigManager.generateCommitMessage(template);
```

### Branch Management

```typescript
// Push to feature branch
await github.extractAndPushTokens({
  branchName: 'feature/token-updates',
  commitMessage: 'Add new color tokens'
});
```

## 🔒 Security Best Practices

### Token Management

1. **Minimal Scopes** - Only grant `repo` scope, avoid broader permissions
2. **Token Rotation** - Regularly update Personal Access Tokens
3. **Team Tokens** - Use organization tokens for team workflows
4. **Environment Separation** - Different tokens for dev/staging/prod

### Repository Setup

1. **Branch Protection** - Protect main branch, require reviews
2. **Access Control** - Limit repository access to design team
3. **Audit Logging** - Monitor token pushes via GitHub audit log

## 🚨 Troubleshooting

### Common Issues

**"Invalid repository URL format"**
```typescript
// ✅ Valid formats
'owner/repo'
'https://github.com/owner/repo'
'https://github.com/owner/repo.git'

// ❌ Invalid formats
'github.com/owner/repo'
'owner/repo/branch'
```

**"Connection test failed"**
1. Verify token is valid and not expired
2. Check repository exists and you have access
3. Ensure token has `repo` scope
4. Test network connectivity

**"Push failed"**
1. Check if repository is archived or read-only
2. Verify branch exists or can be created
3. Ensure file paths are valid
4. Check for large file size limits

### Debug Mode

```typescript
// Enable detailed logging
const github = new GitHubIntegration(tokenExtractor);
await github.initialize();

// Check stored configuration
const config = github.getConfigurationInfo();
console.log('GitHub Config:', config);

// Test rate limits
const client = githubAuth.getClient();
const rateLimit = await client.getRateLimit();
console.log(`API Calls Remaining: ${rateLimit.remaining}/${rateLimit.limit}`);
```

## 📚 API Reference

### GitHubIntegration Methods

- `setupGitHubIntegration(config)` - Initial setup
- `extractAndPushTokens(options)` - Extract + push workflow
- `pushExistingTokens(tokens, message)` - Push existing data
- `testConnection()` - Validate connection
- `getConnectionStatus()` - Get current status
- `listRepositories()` - List available repos
- `clearConfiguration()` - Reset all settings

### GitHubClient Methods

- `getUser()` - Get authenticated user info
- `getRepository(owner, repo)` - Get repo details
- `createFile(owner, repo, path, content)` - Create new file
- `updateFile(owner, repo, path, content, sha)` - Update existing file
- `validateTokenPermissions()` - Check token scopes

## 🔮 Future Enhancements

- **GitHub Apps** - OAuth app authentication for organizations
- **Pull Request Creation** - Automatic PR creation for token updates
- **Branch Strategies** - Configurable branching workflows
- **Webhook Integration** - Trigger builds on token updates
- **Multi-Repository** - Push to multiple repositories
- **Token Processing** - Transform tokens before pushing

## 📞 Support

For issues with the GitHub integration:

1. Check the [Troubleshooting](#troubleshooting) section
2. Verify your token permissions at https://github.com/settings/tokens
3. Test your repository access at https://github.com/owner/repo
4. Review the browser console for detailed error messages