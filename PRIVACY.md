# Privacy Policy for Token Launch

**Effective Date:** 31 December 2025  
**Version:** 1.0.0  
**Plugin Name:** Token Launch  
**Plugin Version Covered:** v1.3.1 and later  
**Developer:** Silvia T.  
**Contact:** silvtgit@gmail.com

---

## Overview

Token Launch is a Figma plugin that extracts design tokens from your Figma designs and automatically pushes them to your GitHub repository. This privacy policy explains how we collect, use, protect, and handle your information when you use our plugin.

---

## Information We Collect

### Data Collected Locally

**GitHub Authentication Tokens**
- Your GitHub personal access tokens are stored encrypted in your local Figma client storage
- Used exclusively to authenticate with GitHub API for repository operations

**Repository Configuration**
- GitHub repository settings (repository URL, branch name, file paths)
- Stored locally to remember your configuration between plugin uses

**Design Token Data**
- Design tokens extracted from your current Figma file during plugin operation
- Includes: colours, typography styles, spacing values, effects, and variables
- Processed temporarily during push operation only

### Data We Do NOT Collect

- We do **not** collect any personal information on external servers
- We do **not** track your usage or analytics
- We do **not** store any data on our servers
- We do **not** use cookies or tracking technologies
- We do **not** collect device information, IP addresses, or browsing history

---

## How We Use Your Information

### Local Storage Only

- All user data is stored exclusively in Figma's `clientStorage` on your local device
- GitHub tokens are encrypted before storage
- Repository settings are stored to remember your configuration between plugin uses
- No user data is transmitted to our servers or any third-party services (except GitHub)

### Core Functionality

**GitHub Integration**
- Your GitHub token is used solely to authenticate with GitHub's API
- Used to push design tokens to your specified repository
- Used to create pull requests on your behalf when you click "Create Pull Request"

**Design Token Extraction**
- We temporarily process design tokens from your current Figma file
- Tokens are formatted as JSON for delivery to your GitHub repository
- Processing occurs in-memory during push operation only

**Icon Display**
- We fetch Phosphor Icons from unpkg.com CDN for the plugin interface
- This is a standard CDN request visible in your browser's developer tools

---

## How We Store Your Data

### Local Storage (Figma clientStorage)

**GitHub Tokens**
- Encrypted using custom encryption before storage
- Storage location: Locally in Figma's secure clientStorage API
- Persistence: Credentials remain until you delete them via "Clear Data" button
- Encryption method: Custom client-side encryption (not cryptographically secure; use token scopes for security)

**Repository Configuration**
- Stored in Figma clientStorage (non-sensitive data, not encrypted)
- Includes: repository owner, name, branch
- Retained until you clear settings or uninstall plugin

**Design Tokens**
- **Not stored** by the plugin after transmission
- Only processed in-memory during active push operation
- Automatically cleared from memory after push completes

### What We Do NOT Store

- No data stored on external servers
- No cloud backups of your credentials
- No server-side databases
- No logs of your design tokens
- No analytics or usage tracking data

---

## Data Retention

### How Long We Keep Your Data

**GitHub Authentication Tokens**
- **Retention:** Indefinitely until you manually delete
- **Why:** Required for ongoing GitHub integration functionality
- **Deletion:** Immediate when you click "Clear Data" or uninstall plugin

**Repository Configuration**
- **Retention:** Indefinitely until you manually delete
- **Why:** Convenience for repeat plugin usage
- **Deletion:** Immediate when you clear settings or uninstall

**Design Tokens (Temporary)**
- **Retention:** Not retained after push
- **Why:** Only processed during active push operation
- **Deletion:** Automatically cleared from memory after push completes

**Plugin Logs/Error Data**
- **Retention:** Not collected or stored
- **Why:** We do not maintain logs

### What Happens When You Uninstall

When you uninstall Token Launch:
1. All data in Figma clientStorage is deleted automatically by Figma
2. GitHub tokens are removed from local storage
3. Repository configuration is deleted
4. No data remains on your device related to the plugin

**Important:** Uninstalling does **not** revoke your GitHub token. To fully revoke access:
1. Visit https://github.com/settings/tokens
2. Delete the token you created for Token Launch

---

## Data Security

### Encryption and Storage

- GitHub tokens are encrypted using custom encryption before storage
- All data remains on your local device within Figma's secure storage system
- No credentials or sensitive data are transmitted in plain text
- We follow security best practices for handling authentication tokens

**Security Limitation:** Our client-side encryption is not military-grade. For maximum security:
- Use GitHub tokens with minimal required scopes (repository access only)
- Revoke tokens when not actively using the plugin
- Never share your GitHub tokens with others

### Network Access

Our plugin only makes network requests to:

**GitHub API** (`https://api.github.com`)
- To push design tokens to your repository
- To create pull requests on your behalf
- All connections secured via HTTPS encryption

**unpkg.com** (`https://unpkg.com`)
- To load Phosphor Icons for the user interface
- Standard CDN request (IP address may be logged by unpkg.com)
- We do not control unpkg.com's data practices
- Privacy policy: https://unpkg.com/

---

## Data Sharing and Third Parties

### No Third-Party Sharing

- We do **not** sell, trade, or share your personal information with third parties
- We do **not** use analytics or tracking services
- We do **not** transmit data to advertising networks
- Your data is never transmitted to our servers

### GitHub API Usage

**Data Transmitted to GitHub:**
- Design tokens (colours, typography, spacing, effects, variables)
- Repository information (owner, name, branch)
- Pull request metadata (title, description, branch information)
- Commit messages (user-customised)

**When Transmission Occurs:**
- Only when you explicitly click "Push to GitHub" or "Create Pull Request"
- Never automatically or in the background
- You have full control over what is pushed and when

**GitHub's Responsibilities:**
- We comply with GitHub's API terms of service
- GitHub's privacy practices: https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement
- We do not control GitHub's data handling after transmission

### unpkg.com (Icon CDN)

**Data Shared:**
- IP address (standard HTTP request)
- Browser user agent (standard HTTP request)

**Privacy Policy:** https://unpkg.com/

**Our Control:** We do not control unpkg.com's data practices

**Alternative:** Icons could be bundled in future plugin versions to eliminate this dependency

---

## International Data Transfers

### GitHub API Data Transfers

**Location:** GitHub API is operated from the United States

**Data Transferred:**
- Design tokens (colours, typography, spacing, effects, variables)
- Repository configuration (owner, name, branch)
- Pull request metadata (title, description)
- Commit messages

**Transfer Mechanism:**
- Data is transmitted via HTTPS-encrypted connection to GitHub's servers
- GitHub complies with applicable data protection frameworks
- GitHub's privacy policy: https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement

**For EEA/UK Users:**
By using Token Launch to push to GitHub, you explicitly consent to the transfer of your design tokens to GitHub's US-based servers. This transfer is necessary for the plugin's core functionality.

**Data Protection Safeguards:**
- GitHub participates in privacy frameworks (see GitHub's privacy policy for details)
- All data transmitted via HTTPS encryption
- You retain full control over what data is pushed and when

### No Other Cross-Border Transfers

All other plugin operations occur **locally on your device**:
- Token extraction happens in your browser
- Credentials stored in Figma's local clientStorage
- No other data leaves your device except GitHub pushes you initiate

### Your Rights Regarding International Transfers

You can:
- Decline to use GitHub integration (use local download instead)
- Revoke GitHub access at any time
- Request deletion of data pushed to GitHub (contact GitHub directly)

---

## Your Rights and Choices

### Data Control

**Access Your Data**
- Stored credentials viewable in Figma's plugin storage (developer mode)
- Design tokens visible before every push (summary display in plugin UI)

**Delete Your Data**
- **"Clear Data" button:** Removes all stored credentials from plugin immediately
- **GitHub Token Revocation:** Revoke tokens at https://github.com/settings/tokens
- **Uninstall Plugin:** Removes all locally stored data automatically

**Control What's Shared**
- Plugin only sends data when you click "Push to GitHub"
- No automatic or background data transmission
- You choose which repository receives tokens
- You customise pull request details before creation

**Withdraw Consent**
- Uninstall the plugin to stop all data processing immediately
- Delete credentials to prevent future GitHub connections
- Revoke GitHub token to invalidate authentication
- Note: This won't affect lawfulness of processing before withdrawal

---

## Legal Compliance

### GDPR Compliance (EU/UK Users)

**Lawful Basis for Processing:**
- **Consent (Article 6(1)(a) GDPR):** You provide consent by using the plugin and configuring GitHub integration
- **Legitimate Interests (Article 6(1)(f) GDPR):** Processing is necessary to provide the plugin's core functionality

**Data Minimisation:**
- We only collect data necessary for plugin operation
- No excessive or unnecessary data collection

**Data Subject Rights:**
- You can access, rectify, or delete your data at any time
- See "Your GDPR Rights" section below for details

**No Profiling:**
- We do not engage in automated decision-making or profiling

### Your GDPR Rights (EEA/UK Users)

If you're in the European Economic Area or United Kingdom, you have the following rights under GDPR:

**Right to Access (Article 15)**
- Request confirmation of what personal data we process
- Receive a copy of your data in electronic format
- To exercise: Contact us at silvtgit@gmail.com

**Right to Rectification (Article 16)**
- Correct inaccurate or incomplete data
- Update your repository configuration via plugin settings
- To exercise: Use plugin's settings interface or contact us

**Right to Erasure / "Right to be Forgotten" (Article 17)**
- Delete all stored credentials and data
- To exercise: Click "Clear Data" in plugin settings or uninstall plugin
- Effect: Immediate deletion from local storage

**Right to Restriction of Processing (Article 18)**
- Limit how we process your data
- To exercise: Disconnect GitHub integration in plugin settings

**Right to Data Portability (Article 20)**
- Receive your data in machine-readable format
- Your GitHub token and repository configuration can be exported
- To exercise: Contact us at silvtgit@gmail.com

**Right to Object (Article 21)**
- Object to processing of your data
- To exercise: Uninstall the plugin or disconnect GitHub integration

**Right to Withdraw Consent**
- Withdraw consent for data processing at any time
- To exercise: Uninstall plugin or clear credentials
- Note: This won't affect lawfulness of processing before withdrawal

**Right to Lodge a Complaint**
- File complaints with your local data protection authority
- **EU residents:** Contact your national supervisory authority
  - List: https://edpb.europa.eu/about-edpb/board/members_en
- **UK residents:** Information Commissioner's Office (ICO)
  - Website: https://ico.org.uk/
  - Phone: 0303 123 1113

**To exercise any of these rights:**
- Email: silvtgit@gmail.com
- Subject line: "GDPR Request - Token Launch"
- We will respond within 30 days as required by GDPR

---

### California Privacy Rights (CCPA/CPRA)

For California residents, you have the following rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):

**Right to Know**

You have the right to request:
- Categories of personal information we collect
- Specific pieces of personal information we've collected about you
- Categories of sources from which we collect information
- Business purposes for collecting information
- Categories of third parties with whom we share information

**Right to Delete**
- Request deletion of personal information we've collected
- To exercise: Click "Clear Data" button in plugin or email silvtgit@gmail.com
- Effect: Immediate deletion for local data
- Note: Deletion is immediate for local data

**Right to Opt-Out of Sale**
- We do **not** sell personal information
- No opt-out action needed

**Right to Non-Discrimination**
- We will not discriminate against you for exercising your CCPA rights
- Same plugin functionality regardless of privacy choices
- No denial of service, different pricing, or different quality of service

**Categories of Personal Information We Collect (CCPA)**

Under CCPA categories:
- **Identifiers:** GitHub username (derived from token), email (if provided for support)
- **Professional Information:** Repository names, organisation names, branch names
- **Internet Activity:** Plugin usage (local only, not tracked externally)

**How to Exercise Your Rights**
- Email: silvtgit@gmail.com
- Subject line: "CCPA Request - Token Launch"
- We will respond within 45 days as required by CCPA
- Verification: We may request confirmation of your identity

**Authorised Agent**
- You may designate an authorised agent to submit requests on your behalf
- The agent must provide written authorisation

**No Sale of Personal Information**
- We do **not** sell your personal information
- We have not sold personal information in the past 12 months

---

### Consent and Legal Basis

**How You Provide Consent**

By using Token Launch, you provide consent for data processing in the following ways:

**Implicit Consent (Plugin Installation)**
- Installing Token Launch indicates consent to local data storage
- You consent to design token extraction from your Figma files

**Explicit Consent (GitHub Integration Setup)**
- Entering your GitHub token constitutes explicit consent for:
  - Storing your encrypted token locally
  - Transmitting design tokens to GitHub when you click "Push"
  - Creating pull requests on your behalf

**Ongoing Consent**
- Each time you click "Push to GitHub," you provide consent for that specific transmission
- You can withdraw consent at any time by:
  - Clicking "Clear Data" button
  - Uninstalling the plugin
  - Revoking your GitHub token

**Legal Basis for Processing (GDPR)**

For EEA/UK users, we process your data based on:

**1. Consent (Article 6(1)(a) GDPR)**
- You provide consent by using the plugin and configuring GitHub integration
- Consent is freely given, specific, informed, and unambiguous
- You can withdraw consent at any time

**2. Legitimate Interests (Article 6(1)(f) GDPR)**
- Processing is necessary to provide the plugin's core functionality
- Our legitimate interest: Providing design token automation tools
- Your interests: Streamlined design-to-development workflow
- Balancing test: Processing is minimal and proportionate

We do **not** rely on:
- Contract performance (no contract between us)
- Legal obligations (no legal requirement to process)
- Vital interests (not life-or-death processing)

---

### Automated Decision-Making and Profiling

Token Launch does **not** engage in:
- Automated decision-making with legal or significant effects
- Profiling based on your personal characteristics
- Algorithmic processing of your personal data
- Automated content moderation or filtering

All plugin actions require your explicit manual input. No automated processing occurs without your direct initiation.

---

## Children's Privacy

Token Launch is not intended for use by children under 13 years of age (or applicable age in your region). We do not knowingly collect personal information from children under 13. 

If we become aware that a child under 13 has provided us with personal information, we will delete such information immediately. 

If you believe a child has used this plugin and provided personal information, please contact us at silvtgit@gmail.com.

---

## Changes to This Privacy Policy

We may update this privacy policy from time to time to reflect:
- Changes in legal requirements
- Updates to plugin functionality
- Improvements to security measures
- User feedback and concerns

**How We Notify You:**
- Updated "Effective Date" at top of this document
- Updated "Version" number
- GitHub repository commit history (public record of changes)
- Plugin update notes (if applicable and significant changes)

**Your Responsibility:**
- Review this policy periodically
- Check "Effective Date" and "Version" for changes
- Contact us with questions about changes

**Material Changes:**
If we make material changes that significantly affect your privacy rights, we will:
- Notify users through the plugin interface
- Provide at least 30 days' notice before changes take effect
- Require re-consent for significant changes

---

## Contact Information

If you have any questions or concerns about this privacy policy or our data practices, please contact us:

**Privacy Enquiries:**
- Email: silvtgit@gmail.com
- Subject line: "Token Launch Privacy Enquiry"

**Technical Support:**
- GitHub Issues: https://github.com/SilvT/Token-Launch-Plugin/issues
- Email: silvtgit@gmail.com

**Data Protection Requests:**
- GDPR requests: silvtgit@gmail.com (Subject: "GDPR Request - Token Launch")
- CCPA requests: silvtgit@gmail.com (Subject: "CCPA Request - Token Launch")

**General Information:**
- Plugin repository: https://github.com/SilvT/Token-Launch-Plugin
- FAQ: https://github.com/SilvT/Token-Launch-Plugin/blob/main/FAQ.md

---

## Technical Details

### Data Types and Storage

| Data Type | Storage Location | Encryption | Retention |
|-----------|-----------------|------------|-----------|
| GitHub Token | Figma clientStorage | Yes (custom client-side) | Until manually removed |
| Repository Config | Figma clientStorage | No (non-sensitive) | Until manually removed |
| Design Tokens | Temporary processing only | N/A | Not stored (cleared after push) |

### Network Requests

All network requests are logged in your browser's developer tools for transparency:

**GitHub API Calls:**
- Endpoint: `https://api.github.com`
- Purpose: Repository operations, pull request creation
- Frequency: Only when you click "Push to GitHub"

**unpkg.com Requests:**
- Endpoint: `https://unpkg.com`
- Purpose: Loading Phosphor Icons for UI
- Frequency: Once per plugin session

**No Other Requests:**
- No analytics or tracking requests
- No advertising network requests
- No third-party data collection services

---

## Compliance Summary

This privacy policy is designed to comply with:
- ✅ **General Data Protection Regulation (GDPR)** - European Union
- ✅ **UK GDPR** - United Kingdom
- ✅ **California Consumer Privacy Act (CCPA)** - California, USA
- ✅ **California Privacy Rights Act (CPRA)** - California, USA
- ✅ **Personal Information Protection and Electronic Documents Act (PIPEDA)** - Canada
- ✅ **Privacy Act 1988** - Australia
- ✅ **Other applicable data protection laws**

**Compliance Highlights:**
- ✅ **Local Storage Only**: All user data stored locally in Figma
- ✅ **Encrypted Credentials**: GitHub tokens encrypted before storage
- ✅ **No Third-Party Sharing**: No data shared with external services (except GitHub for core functionality)
- ✅ **Transparent Operations**: All functionality clearly explained
- ✅ **User Control**: Complete control over data and privacy settings
- ✅ **GDPR/CCPA Compliant**: Meets international privacy requirements
- ✅ **No Tracking**: No analytics, cookies, or user behaviour tracking
- ✅ **Right to Delete**: Immediate data deletion via "Clear Data" button

---

**Last Updated:** 31 December 2025  
**Version:** 1.0.0  
**Plugin Version Covered:** Token Launch v1.3.1 and later

---

*This privacy policy is part of Token Launch's commitment to protecting your privacy and complying with applicable privacy laws and Figma's platform requirements.*