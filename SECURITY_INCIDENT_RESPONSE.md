# Security Incident Response Plan
**Plugin:** Token Launch v1.3.1  
**Last Updated:** 1 January 2026  
**Owner:** Silvia T.

## What Counts as a Security Incident?

A security incident is any of these:
- Someone reports that their GitHub credentials were exposed
- Someone gains unauthorised access to user data
- Token Launch has a vulnerability that could expose user data
- GitHub reports suspicious activity from Token Launch
- A security researcher reports a vulnerability
- Users report data appearing in wrong places

## Immediate Response (Within 1 Hour)

### Step 1: Stop the Bleeding
- [ ] If I can disable the vulnerability immediately (e.g., disable a feature), do it
- [ ] If the whole plugin is compromised, **unpublish it from Figma Community immediately**
  - Go to Figma → Plugins → Development → Token Launch → Unpublish
- [ ] Do NOT delete any logs or data - preserve everything

### Step 2: Assess the Situation
- [ ] What happened? Write it down in plain English
- [ ] How many users might be affected?
- [ ] What data might be exposed? (GitHub tokens, design tokens, repository info)
- [ ] Is the vulnerability still active?

## Within 24 Hours: Notify Figma

### Contact Information
**Email:** support@figma.com  
**Subject Line:** "SECURITY INCIDENT - Token Launch Plugin - [Brief Description]"

### Email Template
```
Subject: SECURITY INCIDENT - Token Launch Plugin - [Brief Description]

Dear Figma Security Team,

I am reporting a security incident involving my Figma Community plugin "Token Launch."

INCIDENT DETAILS:
- Plugin Name: Token Launch
- Plugin ID: [your plugin ID]
- My Email: silvtgit@gmail.com
- Date/Time Discovered: [date and time]
- Date/Time Occurred: [best estimate]

WHAT HAPPENED:
[Describe in 2-3 sentences what happened]

AFFECTED USERS:
- Estimated number of affected users: [number or "unknown"]
- Type of data potentially exposed: [GitHub credentials, design tokens, etc.]

CURRENT STATUS:
- Vulnerability active: [Yes/No]
- Plugin published: [Yes/No - if unpublished, state when]
- Mitigation taken: [What I've done so far]

EVIDENCE PRESERVED:
- [List what logs/data I've kept]

I am available to discuss immediately.

Silvs
silvtgit@gmail.com
```

## Within 48 Hours: Notify Affected Users

### If I Know Who's Affected
- Post prominent notice on GitHub repository README
- Create GitHub Issue titled "SECURITY NOTICE: [Brief Description]"
- Pin the issue
- If I have user emails (I don't), email them

### GitHub Issue Template
```
⚠️ SECURITY NOTICE

A security vulnerability was discovered in Token Launch on [date].

WHAT HAPPENED:
[2-3 sentence explanation]

AFFECTED USERS:
[Who might be affected]

WHAT YOU SHOULD DO:
1. [Specific action, e.g., "Revoke and regenerate your GitHub personal access token"]
2. [Any other protective steps]
3. Update to version X.X.X when available (fix in progress)

WHAT I'M DOING:
- Reported to Figma: [date]
- Fix in development: [expected timeline]
- Plugin status: [Published/Unpublished]

I sincerely apologise for this incident. I take security seriously and am working to ensure this doesn't happen again.

For questions: silvtgit@gmail.com
```

## Fix and Recovery

### Step 3: Fix the Vulnerability
- [ ] Identify root cause
- [ ] Develop fix
- [ ] Test thoroughly
- [ ] Have someone else review the fix if possible
- [ ] Document what was changed

### Step 4: Coordinate with Figma
- [ ] Do NOT republish without Figma's approval
- [ ] Provide Figma with fix details
- [ ] Await their security review if required

### Step 5: Publish Fix
- [ ] Update version number (e.g., v1.3.1 → v1.3.2)
- [ ] Update CHANGELOG.md with security fix notice
- [ ] Publish to Figma Community
- [ ] Update GitHub Issue with resolution

## Post-Incident

### Step 6: Post-Mortem (Within 1 Week)
Create `SECURITY_POSTMORTEM_[DATE].md`:
```
# Security Incident Post-Mortem

**Date of Incident:** [date]
**Date of Post-Mortem:** [date]

## What Happened
[Detailed explanation]

## Root Cause
[Why it happened]

## Timeline
- [Time]: Incident occurred
- [Time]: Discovered
- [Time]: Figma notified
- [Time]: Users notified
- [Time]: Fix deployed

## What Went Well
- [Things that worked]

## What Went Poorly
- [Things that didn't work]

## Action Items to Prevent Recurrence
- [ ] [Specific improvement 1]
- [ ] [Specific improvement 2]
- [ ] [Specific improvement 3]
```

## Prevention Checklist

Regular security practices:
- [ ] Review code for credential exposure before each release
- [ ] Test encryption/decryption thoroughly
- [ ] Never log sensitive data (tokens, credentials)
- [ ] Keep dependencies updated
- [ ] Monitor GitHub Issues for security reports
- [ ] Respond to security researchers respectfully and quickly

## Key Contacts

**Figma:**
- Security: support@figma.com
- Developer Support: [add if you find specific contact]

**GitHub:**
- Security: security@github.com (if GitHub API is involved)

**My Details:**
- Email: silvtgit@gmail.com
- GitHub: https://github.com/SilvT

## Remember

1. **Don't panic** - Follow this checklist step by step
2. **Don't hide it** - Transparency builds trust
3. **Don't delete evidence** - Preserve logs and data
4. **Don't delay** - 24 hours to Figma is a hard deadline
5. **Don't blame users** - Take responsibility

---

Last Reviewed: 1 January 2026