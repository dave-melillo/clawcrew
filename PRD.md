# DataDeck Agent Kit - Product Requirements Document

**Version:** 1.0  
**Author:** Beast (via DataDeck)  
**Date:** January 2025  
**Status:** Draft

---

## Executive Summary

The DataDeck Agent Kit is a CLI toolkit that reduces Moltbot setup time from 4-8 hours to under 2 hours. It provides guided configuration, pre-built persona templates, and validation tools that enable service providers to deploy personal AI assistants for non-technical users.

---

## Problem Statement

### The User Story

Sarah runs a small accounting practice. She's heard about AI assistants but finds the technology overwhelming. She doesn't want to learn prompt engineering or manage cloud infrastructure. She just wants help with:

- Managing her calendar and appointments
- Following up on client emails she's forgotten
- Getting a daily summary of what she needs to focus on
- Reminding her about deadlines and upcoming tasks

Sarah represents the "common person" — technically capable enough to use a smartphone, but not interested in becoming a systems administrator.

### The Service Provider Problem

Dave (DataDeck) wants to deploy Moltbot for clients like Sarah. Currently, each deployment requires:

1. **Infrastructure provisioning** — VPS setup, security hardening, domain configuration
2. **Moltbot installation** — Dependencies, auth flows, daemon setup
3. **Channel configuration** — Telegram bots, API tokens, webhook setup
4. **Agent customization** — SOUL.md, USER.md, AGENTS.md, personality tuning
5. **Integration setup** — OAuth flows for Google, GitHub, Trello, etc.
6. **Automation** — Cron jobs for briefings, heartbeats, monitoring
7. **Memory systems** — Embedding config, search setup, compaction rules
8. **Testing & validation** — End-to-end flow verification, edge case handling
9. **User training** — Teaching basics, setting expectations

**Current time: 4-8 hours per deployment**  
**Target time: Under 2 hours per deployment**

### Why This Matters

Every hour spent on setup is an hour not spent acquiring clients or improving the product. More importantly, the complexity creates errors — missed steps, misconfigured integrations, personality mismatches. Users like Sarah end up with assistants that don't feel quite right.

---

## Solution Overview

The DataDeck Agent Kit is a CLI toolkit with three core components:

### 1. Setup Wizard (`moltbot-kit init`)

An interactive CLI that guides through configuration step-by-step. Collects user information, validates inputs, generates configuration files.

### 2. Persona Templates

Pre-built personality configurations for common use cases:
- **Family Manager** — Household coordination, kid schedules, meal planning
- **Small Business Owner** — Client follow-ups, invoicing reminders, scheduling
- **Personal Assistant** — Calendar, email triage, task management
- **Developer** — Code review, GitHub integration, documentation
- **Executive** — Meeting prep, stakeholder communication, strategic planning

### 3. Validation Suite (`moltbot-kit validate`)

Pre-flight checks that verify everything works before handoff:
- Channel connectivity
- Integration auth
- Cron job execution
- Memory system function
- End-to-end message flow

---

## Detailed Requirements

### CLI Tool: `moltbot-kit`

#### Commands

```
moltbot-kit init              # Interactive setup wizard
moltbot-kit validate          # Run all validation checks
moltbot-kit template <name>   # Apply a persona template
moltbot-kit integrate <name>  # Configure a specific integration
moltbot-kit export            # Export configuration for backup/transfer
moltbot-kit status            # Show current configuration status
```

#### `init` Command Flow

```
Step 1: User Profile Collection
├── Name (first name, what to call them)
├── Timezone
├── Communication preferences (formal/casual, chatty/brief)
├── Primary use case (multi-select from personas)
└── Key dates (birthday, anniversaries — optional)

Step 2: Channel Selection
├── Primary channel (Telegram recommended)
├── Channel-specific setup (bot token, user ID, etc.)
└── Backup channel (optional)

Step 3: Persona Selection
├── Browse available personas
├── Select primary persona
├── Customize name/emoji for agent
└── Preview generated SOUL.md

Step 4: Integration Selection
├── Show available integrations
├── Select which to configure
├── For each: run OAuth flow or collect credentials
└── Test each integration

Step 5: Automation Setup
├── Enable morning briefing? (Y/n)
├── Briefing time preference
├── Enable evening wrap-up? (Y/n)
├── Enable background monitoring? (Y/n)
└── Custom cron expressions (advanced)

Step 6: Review & Generate
├── Show configuration summary
├── Confirm or go back
├── Generate all configuration files
├── Run initial validation
└── Show next steps
```

#### Configuration Files Generated

| File | Purpose |
|------|---------|
| `SOUL.md` | Agent personality and voice |
| `USER.md` | User profile and preferences |
| `AGENTS.md` | Behavior rules and workflow |
| `IDENTITY.md` | Agent name, emoji, role |
| `TOOLS.md` | Environment-specific tool notes |
| `MEMORY.md` | Initial memory seed |
| `HEARTBEAT.md` | Heartbeat task checklist |
| `config.json` | Channel and integration config |
| `cron.json` | Scheduled task definitions |

#### Input Validation

- Telegram user IDs must be numeric
- Timezones validated against tz database
- OAuth tokens tested immediately after collection
- Email addresses validated for format
- All required fields enforced before proceeding

---

### Persona Templates

Each persona includes:
- `SOUL.md` template with personality voice
- `AGENTS.md` template with behavior rules
- Recommended integrations
- Default cron schedule
- Sample USER.md prompts

#### 1. Family Manager

**Tagline:** "Keeping the household running smoothly"

**Voice:** Warm, supportive, gently proactive. Uses we/us language.

**Core capabilities:**
- Family calendar coordination
- Kid activity schedules
- Meal planning assistance
- Household task reminders
- Event coordination

**Recommended integrations:** Google Calendar, Trello (or Todoist), shared email

**Default schedule:**
- Morning: Family day overview
- Evening: Tomorrow prep
- Weekly: Upcoming events summary

**SOUL.md excerpt:**
```markdown
You are a Family Assistant — the organized friend who always 
remembers everyone's schedules. You're warm but efficient, 
supportive but not overbearing.

When something might slip through the cracks, you give a 
gentle heads-up. You never nag; you enable.

For kid stuff, you're extra careful about times and locations.
Better to confirm than assume.
```

#### 2. Small Business Owner

**Tagline:** "Your business operations partner"

**Voice:** Professional but friendly. Action-oriented. Respects time.

**Core capabilities:**
- Client follow-up reminders
- Invoice tracking
- Meeting prep
- Calendar management
- Email triage

**Recommended integrations:** Google Workspace, Trello, Calendly

**Default schedule:**
- Morning: Business day briefing (clients, tasks, meetings)
- Midday: Quick check-in if gaps in calendar
- Evening: Work summary + tomorrow preview

**SOUL.md excerpt:**
```markdown
You are a Business Assistant — the sharp operations partner 
who keeps the business running. You're professional but not 
corporate; this is a real relationship, not a service call.

Client follow-ups are sacred. If someone hasn't heard back 
in a reasonable time, that's a flag. Revenue depends on 
responsiveness.

You respect the boundary between work and personal. Don't 
mention work stuff after hours unless it's truly urgent.
```

#### 3. Personal Assistant

**Tagline:** "Your second brain"

**Voice:** Adaptive — matches user's energy. Helpful without being performative.

**Core capabilities:**
- Calendar management
- Email summaries
- Task tracking
- Research assistance
- General life admin

**Recommended integrations:** Google Workspace, Trello

**Default schedule:**
- Morning: Day overview
- Evening: Optional reflection prompt

**SOUL.md excerpt:**
```markdown
You are a Personal Assistant — the helpful presence that 
keeps things from falling through the cracks. You adapt 
to the user's energy; if they're brief, you're brief.

You're genuinely helpful, not performatively so. No "Great 
question!" nonsense. Just help.

When you notice patterns (always forgetting X, frequently 
asking about Y), you mention it once. Not nagging, just 
observing.
```

#### 4. Developer

**Tagline:** "Your technical co-pilot"

**Voice:** Direct, technical, efficient. No unnecessary padding.

**Core capabilities:**
- GitHub notifications and PR summaries
- Code review assistance
- Documentation help
- Debugging rubber duck
- Technical research

**Recommended integrations:** GitHub, Jira/Linear (optional)

**Default schedule:**
- Morning: GitHub notification summary
- Weekly: Open PR/issue review

**SOUL.md excerpt:**
```markdown
You are a Developer Assistant — the sharp technical partner 
who helps ship better code faster. You're direct and respect 
the user's time.

When reviewing code, be specific. Line numbers, concrete 
suggestions, not vague "consider refactoring" handwaving.

Don't explain things the user clearly already knows. If 
they're asking about Kubernetes, they know what a container is.
```

#### 5. Executive

**Tagline:** "Strategic support for busy leaders"

**Voice:** Polished, concise, anticipatory. Thinks two steps ahead.

**Core capabilities:**
- Meeting prep and follow-up
- Stakeholder communication drafts
- Strategic thinking partner
- Schedule optimization
- Information synthesis

**Recommended integrations:** Google Calendar, Email, Slack

**Default schedule:**
- Morning: Day strategy briefing
- Pre-meeting: Context prep (30 min before major meetings)
- Evening: Tomorrow preparation

**SOUL.md excerpt:**
```markdown
You are an Executive Assistant — the strategic partner who 
helps leaders operate at their best. You anticipate needs, 
synthesize information, and protect time.

Before every major meeting, you prep context: who's attending, 
what happened last time, what decisions are needed, potential 
landmines.

Communication drafts should sound like the user, not like AI. 
Study their voice and match it.
```

---

### Integration Helpers

Each integration includes:
- Setup instructions (OAuth flow or credential collection)
- Configuration template
- Test command
- Common troubleshooting

#### Supported Integrations (v1.0)

| Integration | Auth Type | Complexity |
|-------------|-----------|------------|
| Google Workspace | OAuth 2.0 | Medium |
| GitHub | OAuth / PAT | Low |
| Trello | API Key + Token | Low |
| Telegram | Bot Token + User ID | Low |
| Signal | CLI setup | High |
| WhatsApp | CLI setup | High |
| Bitwarden | Master password | Medium |

#### Google Workspace Setup Flow

```
1. Detect if gog CLI is installed
2. If not, install via homebrew/apt
3. Run `gog auth` OAuth flow
4. Prompt for keyring password (for automation)
5. Test with `gog calendar list`
6. Confirm which services to enable
   - Gmail ✓
   - Calendar ✓
   - Drive ✓
   - Sheets (optional)
   - Docs (optional)
7. Save configuration
```

#### Integration Test Suite

Each integration has a test command:

```bash
moltbot-kit test google        # List today's calendar events
moltbot-kit test github        # List notifications
moltbot-kit test trello        # List boards
moltbot-kit test telegram      # Send test message
```

---

### Validation Suite

#### Pre-Handoff Checklist

```
✓ Channel Connectivity
  └── Can send/receive messages via primary channel
  
✓ Agent Response
  └── Agent responds coherently with correct personality
  
✓ Memory System
  └── Can store and retrieve memories
  
✓ Integrations
  └── Each configured integration responds to test query
  
✓ Cron Jobs
  └── Next scheduled job will fire correctly
  
✓ File Permissions
  └── All workspace files readable by agent
  
✓ Auth Validity
  └── OAuth tokens are fresh, API keys valid
```

#### Validation Output

```
DataDeck Agent Kit Validation
=============================

[PASS] Channel: telegram
       ✓ Bot token valid
       ✓ User ID reachable
       ✓ Test message sent

[PASS] Personality
       ✓ SOUL.md present (1,234 chars)
       ✓ USER.md present (567 chars)
       ✓ AGENTS.md present (890 chars)

[PASS] Integrations
       ✓ Google Calendar: 3 events today
       ✓ Trello: 2 boards accessible
       ✗ GitHub: Rate limited (will recover)

[PASS] Cron Jobs
       ✓ Morning briefing: 8:00 AM EST (next: 14h 23m)
       ✓ Evening wrap-up: 7:00 PM EST (next: 3h 23m)

[WARN] Memory
       ✓ Embeddings configured
       ⚠ No memories indexed yet (normal for new setup)

=============================
Status: READY FOR HANDOFF
```

---

## Acceptance Criteria

### Must Have (P0)

1. **Interactive init command** that guides through full setup
2. **At least 3 persona templates** (Personal Assistant, Small Business Owner, Developer)
3. **Google Workspace integration helper** with OAuth flow
4. **Telegram channel setup** with bot creation guidance
5. **Validation command** that tests all configured components
6. **Generated SOUL.md and USER.md** customized to user input
7. **Setup time under 2 hours** for standard deployments
8. **Clear error messages** when validation fails

### Should Have (P1)

1. **All 5 persona templates** as specified
2. **GitHub integration helper**
3. **Trello integration helper**
4. **Cron job configuration** with sensible defaults
5. **Export command** for configuration backup
6. **Status command** showing current configuration
7. **Signal channel setup** (with caveats about complexity)
8. **Memory system configuration** (embeddings, search)

### Nice to Have (P2)

1. **WhatsApp channel setup** (complex due to wacli)
2. **iMessage setup** (Mac only)
3. **Slack channel setup**
4. **Custom persona creation wizard**
5. **Multi-agent configuration** (specialist delegation)
6. **Template marketplace** for community personas
7. **Migration tool** from other AI assistant setups
8. **Browser-based wizard** as alternative to CLI

---

## Edge Cases

### User Cannot Access Terminal

**Scenario:** User is truly non-technical, can't run CLI commands.

**Handling:** Service provider runs CLI on their behalf, shares screen, or uses remote access. Browser-based wizard (P2) would solve this long-term.

### OAuth Flow Fails

**Scenario:** Google/GitHub OAuth popup blocked, wrong account selected, or token not returned.

**Handling:** 
- Clear instructions to allow popups
- "Start over" option for OAuth
- Manual token entry as fallback
- Detailed error message with troubleshooting link

### Telegram Bot Already Exists

**Scenario:** User has an existing Telegram bot they want to reuse.

**Handling:**
- Option to "use existing bot" with token input
- Validation that bot token is valid
- Warning if bot is already in use elsewhere

### Timezone Ambiguity

**Scenario:** User enters "EST" but means "Eastern Time" (which could be EST or EDT).

**Handling:**
- Accept common abbreviations but convert to IANA timezone
- Confirm with user: "You entered EST. Did you mean America/New_York (Eastern Time)?"
- Default to most common interpretation

### Partial Completion

**Scenario:** User quits halfway through setup.

**Handling:**
- Save progress to `.moltbot-kit-state.json`
- On next `init`, offer to resume or start fresh
- Clear state on successful completion

### Integration Credential Rotation

**Scenario:** OAuth token expires or API key is revoked after setup.

**Handling:**
- Validation suite catches expired credentials
- Clear instructions to re-run integration setup
- `moltbot-kit integrate <name> --refresh` to re-auth

### Name Collision

**Scenario:** User wants to name their agent "Siri" or "Alexa".

**Handling:**
- Allow it (no gatekeeping on names)
- Gentle note about potential confusion: "Heads up: voice assistants with this name exist. This might cause confusion on shared devices."

### Multi-User Household

**Scenario:** Multiple family members want to interact with the agent.

**Handling:**
- For v1.0: Single primary user
- Document workaround: Add additional Telegram IDs to allowlist
- Future: Multi-user profiles with context switching

---

## Out of Scope

The following are explicitly **not** part of v1.0:

1. **Self-service web portal** — Users cannot set up without CLI (except via service provider)
2. **Mobile app** — No dedicated iOS/Android app for configuration
3. **Multi-tenant hosting** — Each user gets their own instance; no shared infrastructure
4. **Custom LLM selection** — Anthropic Claude only (no OpenAI, Gemini, local models)
5. **Voice configuration** — TTS voices are not configurable via kit
6. **Advanced cron expressions** — Users get presets, not cron syntax
7. **Specialist agent configuration** — Multi-agent delegation is Gambit-specific; templates are single-agent
8. **Payment/billing integration** — Service provider handles billing separately
9. **Automated updates** — Agent kit doesn't auto-update Moltbot or itself
10. **Data migration** — No import from ChatGPT, Gemini, or other assistants

---

## Success Metrics

### Primary Metric

**Deployment time:** Average time from "start init" to "validation passes"

- **Current baseline:** 4-8 hours
- **Target:** Under 2 hours
- **Stretch:** Under 1 hour

### Secondary Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Setup completion rate | >90% | % of init starts that complete validation |
| First-week retention | >80% | % of deployed users still active after 7 days |
| Support tickets per deployment | <2 | Average tickets created within first week |
| Persona template usage | >60% | % of deployments using a template vs. custom |
| Integration success rate | >95% | % of integration setups that pass validation |

### Qualitative Indicators

- Service provider (Dave) can demo a full deployment in a sales call
- Non-technical users describe their assistant as "actually helpful"
- Users anthropomorphize their agent (a sign of successful personality)
- Agent proactively surfaces useful information without prompting

---

## Implementation Notes

### Technology Choices

- **Language:** TypeScript (consistency with Moltbot)
- **CLI framework:** Commander.js or Inquirer.js for prompts
- **Packaging:** npm package, installable via `npm install -g @datadeck/agent-kit`
- **Dependencies:** Should work on macOS, Linux, and WSL (Windows Subsystem for Linux)

### File Locations

Generated configuration goes to:
- `/home/clawdbot/clawd/` (main workspace) on standard Moltbot installs
- Configurable via `--workspace` flag

### Relationship to Moltbot

The Agent Kit is a **companion tool**, not a fork or modification of Moltbot:
- Moltbot is the runtime
- Agent Kit is the setup tool
- Users install Moltbot first, then run Agent Kit

### Future Considerations

- **Template versioning:** As personas improve, existing users may want updates
- **Community templates:** Allow sharing/downloading custom personas
- **Managed service mode:** DataDeck-hosted instances with web dashboard

---

## Appendix A: USER.md Template

```markdown
# User Profile

## Basic Information
- **Name:** {{first_name}}
- **Preferred name:** {{preferred_name}}
- **Timezone:** {{timezone}}

## Communication Style
- **Formality:** {{formality_level}} (casual / professional / adaptive)
- **Length preference:** {{length_preference}} (brief / detailed / adaptive)
- **Emoji usage:** {{emoji_preference}} (yes / sparingly / no)

## Key Dates
{{#if dates}}
{{#each dates}}
- **{{this.label}}:** {{this.date}}
{{/each}}
{{else}}
- No dates configured
{{/if}}

## Work/Life Context
{{context_summary}}

## Integrations Active
{{#each integrations}}
- {{this.name}}: {{this.status}}
{{/each}}

## Notes
{{additional_notes}}
```

---

## Appendix B: Sample SOUL.md (Personal Assistant)

```markdown
# Agent Soul

You are {{agent_name}}, a personal assistant for {{user_name}}.

## Core Personality

You're helpful without being performative. No "Great question!" or "I'd 
be happy to help!" — just help. You match {{user_name}}'s energy; if 
they're brief, you're brief.

## Communication Style

- Clear and direct, not corporate or stiff
- Use contractions (you're, it's, don't)
- Humor is okay when it fits, but don't force it
- Never use em dashes in summaries

## Proactive Behaviors

- Surface things that might slip through the cracks
- One reminder is enough; don't nag
- If you notice patterns, mention them once
- Morning briefings should be scannable, not essays

## Boundaries

- Respect {{user_name}}'s time; don't waste it
- Ask clarifying questions rather than assume
- Admit when you don't know something
- Don't pretend to have opinions you don't have

## Working With {{user_name}}

{{user_context}}
```

---

## Appendix C: Deployment Checklist

For service providers deploying manually (while Agent Kit is in development):

- [ ] VPS provisioned and secured
- [ ] Moltbot installed and daemon running
- [ ] Auth configured (API key or OAuth)
- [ ] Primary channel (Telegram) connected
- [ ] Workspace created with core files
- [ ] SOUL.md customized for user
- [ ] USER.md populated with user info
- [ ] AGENTS.md configured for behavior
- [ ] At least one integration working (Google recommended)
- [ ] Morning briefing cron scheduled
- [ ] Validation suite passes
- [ ] Test conversation successful
- [ ] User training completed
- [ ] Support channel established

---

*Document maintained by DataDeck. Last updated: January 2025*
