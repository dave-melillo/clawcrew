# ClawCrew - Product Requirements Document

**Version:** 2.0  
**Author:** Gambit + Beast  
**Date:** February 2026  
**Status:** Vision Update - North Star Defined

---

## 🎯 What Changed in v2.0

**v1.0 Vision:** CLI toolkit for service providers to deploy Moltbot instances for clients  
**v2.0 Vision:** Consumer product - people deploy their own openclaw with agent library + personality customization

**Key Shift:** From B2B2C (Dave deploys for clients) to B2C (users deploy for themselves)

**Inspiration:** Products hitting $7K MRR in 3 days prove people will pay premium for "complex tech made simple." ClawCrew applies that to personal AI teams.

---

## Executive Summary

ClawCrew is a consumer product that makes deploying your own AI team as easy as signing up for a SaaS. Choose from pre-built agent archetypes, customize their personalities, and deploy a full openclaw instance in under 30 minutes. No technical knowledge required.

**North Star:** The $7K MRR in 3 days product model — people want AI power without complexity. ClawCrew delivers that for personal AI teams.

---

## Problem Statement

### The User Story

Sarah runs a small accounting practice. She's heard about AI assistants like ChatGPT, but they're generic and don't actually *know* her. She wants an AI that:

- Understands her business and remembers context
- Has access to her calendar, email, and tools
- Can act proactively, not just respond to prompts
- Feels like a real assistant, not a chatbot

She's tried setting up opensource alternatives but hit walls:
- Complex installation guides
- Confusing configuration files
- No guidance on what "personality" even means
- Hours of trial and error

**What Sarah wants:** Click a button, pick an assistant type, give it a personality, and have it working in 30 minutes.

### The Market Opportunity

AI assistant platforms are exploding, but they fall into two camps:

**Generic SaaS (ChatGPT, Claude, Gemini):**
- ✅ Easy to use
- ✅ No setup required
- ❌ Zero customization
- ❌ No memory between sessions
- ❌ Can't access your tools
- ❌ Feels like a product, not a person

**Self-Hosted (Moltbot, openclaw, etc.):**
- ✅ Fully customizable
- ✅ Deep integration with your tools
- ✅ True memory and personality
- ❌ 4-8 hours to set up
- ❌ Requires technical knowledge
- ❌ Easy to misconfigure

**ClawCrew bridges the gap:** Easy as SaaS, powerful as self-hosted.

### Why This Matters

The market has proven people will pay for "batteries included" AI tools. A product that hit **$7K MRR in 3 days** shows there's massive demand for simplicity without sacrificing power.

ClawCrew democratizes personal AI teams. Not just for developers or companies — for everyone.

### Key Insight: The $7K MRR Model

**Observation:** A side project hitting $7K MRR in 3 days proves a critical market truth:

**People will pay premium prices for tools that make complex technology instantly accessible.**

The pattern repeats across successful products:
- **Stripe** — Made payment processing trivial (vs. manual merchant accounts)
- **Vercel** — Made deployment one-click (vs. manual server config)
- **Superhuman** — Made email management delightful (vs. Gmail power-user gymnastics)

**ClawCrew follows the same playbook for personal AI:**
- ❌ 4-8 hours of configuration → ✅ 30-minute wizard
- ❌ Reading documentation → ✅ Choosing from templates
- ❌ Writing SOUL.md → ✅ Describing what you want in plain English
- ❌ Debugging integrations → ✅ One-click OAuth flows

**The willingness to pay exists.** The product just needs to deliver on the promise of simplicity.

---

## Solution Overview

ClawCrew is a **web-based onboarding wizard** that deploys a fully configured openclaw instance in 3 steps:

### 1. Choose Your Crew (Agent Library)

Browse a catalog of pre-built agent archetypes:
- **Personal Assistant** — Your second brain for life admin
- **Business Manager** — Client follow-ups, invoicing, scheduling
- **Family Coordinator** — Household planning and kid wrangling
- **Developer Sidekick** — Code review, GitHub, documentation
- **Research Partner** — Deep dives, summaries, learning
- **Creative Collaborator** — Writing, brainstorming, ideation

Each archetype comes with:
- **Pre-configured personality** (voice, tone, behaviors)
- **Recommended integrations** (Google, GitHub, Trello, etc.)
- **Default automations** (morning briefings, reminders, monitoring)
- **Sample interactions** (so you know what to expect)

**Future:** Community marketplace where users can share custom agent types.

### 2. Make It Yours (Personality Customization)

Give your agent a unique personality:
- **Name** — "Jarvis", "Samantha", "Alex", or something personal
- **Voice** — Formal/casual, chatty/brief, playful/serious
- **Emoji style** — Liberal, occasional, never
- **Quirks** — Cajun flair, dry humor, optimistic encourager, etc.
- **Preview** — See sample messages in different styles

**The magic:** You're not writing config files. You're having a conversation about what you want, and ClawCrew translates that into SOUL.md, USER.md, and AGENTS.md automatically.

### 3. Deploy & Connect (One-Click Setup)

ClawCrew handles everything:
- **Infrastructure provisioning** — Spin up a VPS or use your own
- **openclaw installation** — Latest stable version, pre-configured
- **Channel setup** — Connect Telegram (or Signal, WhatsApp, etc.)
- **Integration OAuth** — One-click flows for Google, GitHub, Trello
- **First conversation** — Test message to confirm it's working

**Time from start to "Hello!":** Under 30 minutes.

**Hosting options:**
- **ClawCrew-hosted** (easiest, $XX/month)
- **Your own VPS** (bring your own server, pay only for the tool)
- **Local** (advanced users, run on your own hardware)

---

## The Agent Library

The heart of ClawCrew is the **Agent Library** — a curated collection of pre-built agent types that people can deploy instantly.

### What Makes a Good Agent Archetype?

Each agent type in the library should:

1. **Solve a clear use case** — Not "general AI", but "helps small business owners stay on top of clients"
2. **Have a distinct personality** — Not generic chatbot voice, but a character people can connect with
3. **Come with integrations** — Pre-configured connections to relevant tools
4. **Be immediately useful** — Working automations from day one

### Agent Library v1.0

#### Personal Assistant
**Tagline:** "Your second brain"  
**Use case:** Life admin, calendar, email triage, reminders  
**Personality:** Adaptive (matches your energy), helpful without being performative  
**Integrations:** Google Workspace, Trello/Todoist  
**Automations:** Morning overview, evening reflection  

#### Business Manager  
**Tagline:** "Your operations partner"  
**Use case:** Client follow-ups, invoicing, meeting prep  
**Personality:** Professional but friendly, action-oriented  
**Integrations:** Google Workspace, Trello, Calendly  
**Automations:** Business day briefing, client follow-up reminders  

#### Family Coordinator
**Tagline:** "Keeping the household running"  
**Use case:** Family calendar, kid activities, meal planning, events  
**Personality:** Warm, supportive, gently proactive  
**Integrations:** Shared Google Calendar, Trello (family board)  
**Automations:** Daily family overview, weekly event summary  

#### Developer Sidekick
**Tagline:** "Your technical co-pilot"  
**Use case:** Code review, GitHub notifications, documentation, debugging  
**Personality:** Direct, technical, efficient  
**Integrations:** GitHub, Linear/Jira (optional)  
**Automations:** GitHub notification summary, open PR/issue reviews  

#### Research Partner
**Tagline:** "Deep dives on demand"  
**Use case:** Research topics, summarize articles, learning assistance  
**Personality:** Curious, thorough, clear explainer  
**Integrations:** Web search, YouTube, Drive (for notes)  
**Automations:** Weekly learning summary, topic deep-dives  

#### Creative Collaborator
**Tagline:** "Your brainstorming buddy"  
**Use case:** Writing assistance, ideation, creative feedback  
**Personality:** Encouraging, playful, idea-generator  
**Integrations:** Drive (for drafts), web search (for inspiration)  
**Automations:** Weekly creative prompts, idea capture  

### Agent Library v2.0 (Future)

- **Fitness Coach** — Workout tracking, nutrition, motivation
- **Finance Tracker** — Budget monitoring, expense categorization
- **Learning Tutor** — Personalized study plans, quiz generation
- **Travel Planner** — Itinerary building, booking reminders
- **Community Marketplace** — User-created agent types

### Why This Matters

**People don't want to configure SOUL.md files. They want to say "I need help running my business" and get a working solution.**

The agent library lets users start with proven templates, then customize from there. It's the difference between:
- ❌ "Here's a blank canvas, good luck"
- ✅ "Here are 6 starting points, pick one and make it yours"

---

## Detailed Requirements

### Onboarding Wizard (Web App)

#### User Flow

**Step 1: Welcome & Intro (30 seconds)**
- Explain what ClawCrew does in simple terms
- Show a 30-second demo video of agent interaction
- "Ready to build your crew? Let's go."

**Step 2: Choose Your Agent (2 minutes)**
- Browse the agent library (cards with descriptions)
- See sample conversations for each type
- Select one to start (can add more later)
- Option to "start from scratch" (advanced users)

**Step 3: Customize Personality (3 minutes)**
- **Name:** What should we call your agent?
- **Voice:** Interactive slider (formal ↔ casual, brief ↔ detailed)
- **Style:** Pick from personality presets or describe in your own words
- **Preview:** See how the agent would respond to sample messages
- Auto-generates SOUL.md in the background

**Step 4: Tell Us About You (2 minutes)**
- **Name:** What should the agent call you?
- **Timezone:** Auto-detect with manual override
- **Context:** "In 2-3 sentences, what do you want this agent to help with?"
- Auto-generates USER.md

**Step 5: Connect Your Tools (5-10 minutes)**
- Show recommended integrations for the chosen agent type
- One-click OAuth flows (Google, GitHub, Trello, etc.)
- Option to skip and add later
- Each integration tested immediately after connection

**Step 6: Set Up Automations (2 minutes)**
- Default automations for the agent type are pre-checked
- Morning briefing time picker (default 8 AM in user's timezone)
- Evening wrap-up toggle
- Heartbeat monitoring toggle
- Advanced users can add custom cron jobs

**Step 7: Deploy (5-10 minutes)**
- Choose hosting:
  - ClawCrew-hosted (instant, managed)
  - Your own VPS (enter SSH details)
  - Local (download installer)
- Infrastructure provisioning happens in background
- Progress bar with status updates
- First test message sent automatically

**Step 8: You're Live! (1 minute)**
- "Say hello to [Agent Name]!"
- Quick tutorial on how to interact
- Link to help docs and community
- "What would you like to do first?" prompt

**Total time:** 20-30 minutes for typical setup

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

### North Star Metric

**Weekly Active Users (WAU):** Number of users who have at least one conversation with their agent each week.

- **Target:** 80%+ retention at 4 weeks
- **Indicator of:** Product delivering real value, not just initial curiosity

### Primary Metrics

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| **Setup completion rate** | >85% | Users who start onboarding finish it |
| **Time to first message** | <30 min | Speed = delight + lower drop-off |
| **Agent template usage** | >70% | Validates the library approach |
| **Integration adoption** | Avg 2-3 per user | More integrations = stickier users |
| **30-day retention** | >75% | Product is useful long-term, not novelty |
| **NPS (Net Promoter Score)** | >50 | Users would recommend to friends |

### Revenue Metrics (SaaS Model)

| Metric | Target | Notes |
|--------|--------|-------|
| **MRR growth** | 20%+ monthly | Following the $7K MRR benchmark |
| **CAC (Customer Acquisition Cost)** | <$50 | Organic + word-of-mouth focused |
| **LTV (Lifetime Value)** | >$500 | Annual retention target: 70%+ |
| **Free-to-paid conversion** | >10% | For freemium model (if offered) |

### Qualitative Indicators

**Evidence the product is working:**
- Users name their agents (anthropomorphization)
- Users share screenshots of helpful interactions
- Support requests are feature asks, not bug reports
- Community forum has active "show & tell" threads
- Users create and share custom agent templates

**Evidence of product-market fit:**
- Organic signups exceed paid acquisition
- Users describe the product as "can't live without it"
- Inbound partnership/integration requests
- Media coverage without outreach

---

## Business Model

### Pricing Tiers

**Free Tier (Limited)**
- 1 agent
- Basic integrations (Google, Telegram)
- Community support only
- ClawCrew-hosted with usage limits (100 messages/day)
- **Goal:** Let people try before committing

**Pro Tier ($20-30/month)**
- Up to 3 agents
- All integrations
- Priority support
- ClawCrew-hosted (unlimited messages)
- Custom automations
- **Goal:** Individual power users, small teams

**Team Tier ($50-100/month)**
- Unlimited agents
- Shared agents (multi-user access)
- Advanced integrations (Slack, custom webhooks)
- Premium support
- Option for dedicated infrastructure
- **Goal:** Small businesses, family accounts

**Enterprise (Custom)**
- White-label option
- Self-hosted with managed support
- Custom integrations
- SLA guarantees
- **Goal:** Companies deploying AI assistants at scale

### Alternative: "Bring Your Own Infrastructure"

**Pay-per-seat model ($10/month per agent):**
- User provides their own VPS or runs locally
- ClawCrew wizard + ongoing updates
- Community support
- **Goal:** Technical users who want control + cost savings

### Revenue Projections (Optimistic)

**Month 1-3 (Beta):**
- 100 free users
- 20 paying ($25 avg) = $500 MRR

**Month 4-6 (Public Launch):**
- 500 free users
- 150 paying ($25 avg) = $3,750 MRR

**Month 7-12 (Growth):**
- 2,000 free users
- 500 paying ($30 avg) = $15,000 MRR

**Year 2 Target:**
- $100K MRR (following $7K in 3 days benchmark trajectory)

---

## Go-to-Market Strategy

### Launch Plan

**Phase 1: Private Beta (Month 1-2)**
- Invite-only access
- Target: 50-100 early adopters
- Focus: Product feedback, bug squashing
- Channels: Twitter, Hacker News, Product Hunt teaser

**Phase 2: Public Beta (Month 3-4)**
- Open signups with waitlist
- Target: 500 users
- Focus: Stability, onboarding polish
- Channels: Product Hunt launch, demo videos, word-of-mouth

**Phase 3: v1.0 Launch (Month 5-6)**
- Full public release
- Target: 2,000+ users
- Focus: Marketing, community building
- Channels: Content marketing, partnerships, paid ads (if needed)

### Marketing Channels

**Organic (Primary):**
- Twitter/X — Demo videos, use cases, success stories
- YouTube — Setup tutorials, "day in the life" content
- Blog — SEO-optimized guides ("How to build a personal AI assistant")
- Community — Discord/forum for users to share tips

**Partnerships:**
- Integration partners (Google, Notion, Linear, etc.)
- Influencers in productivity/AI space
- Developer advocates

**Paid (Secondary):**
- Google/Facebook ads targeting "AI assistant" keywords
- Sponsored content on tech blogs
- Podcast sponsorships (productivity/tech shows)

### Key Messages

**Headline:** "Your AI team, deployed in 30 minutes"

**Value props:**
- **Easy as SaaS** — No technical knowledge required
- **Powerful as self-hosted** — Full control, deep integrations
- **Yours forever** — Not locked into a platform, export anytime
- **Privacy-first** — Your data, your infrastructure (optional)

---

## Implementation Notes

### Technology Choices

**Frontend (Web App):**
- **Framework:** Next.js (React) or SvelteKit
- **Styling:** Tailwind CSS for rapid UI development
- **Hosting:** Vercel or similar edge platform
- **Auth:** Clerk or Auth0 for user accounts

**Backend (API + Orchestration):**
- **Language:** TypeScript/Node.js (consistency with Moltbot/openclaw)
- **API:** REST or tRPC for type-safe client-server communication
- **Infrastructure provisioning:** Terraform or Pulumi for VPS deployment
- **Queue:** Bull or BullMQ for background job processing (deployments, validations)

**Database:**
- **User data:** PostgreSQL (Supabase or Railway)
- **Agent configs:** Store generated SOUL.md, USER.md, etc. as files in user workspace
- **Caching:** Redis for session state, deployment status

**Deployment Automation:**
- **VPS providers:** DigitalOcean, Linode, Hetzner (user choice)
- **Deployment:** Ansible playbooks or custom scripts
- **Monitoring:** Built-in health checks, user dashboard for agent status

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
