# ClawCrew Web App - Product Requirements Document

**Version:** 1.0  
**Author:** Beast (Research & Documentation)  
**Date:** January 2025  
**Status:** Draft for Review

---

## Executive Summary

ClawCrew Web App is a visual interface for building and managing multi-agent AI teams. While competitors like SimpleClaw and Clawi.ai offer single-agent setups, ClawCrew's differentiator is **teams** - multiple specialized AI agents that collaborate, each with distinct personalities and capabilities.

The web app abstracts away CLI complexity, making multi-agent AI accessible to non-technical users. Under the hood, it generates the same `moltbot.json` and `SOUL.md` files that power the CLI tool.

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [User Personas](#user-personas)
3. [Competitive Analysis](#competitive-analysis)
4. [Feature Breakdown](#feature-breakdown)
5. [Wireframes](#wireframes)
6. [Technical Architecture](#technical-architecture)
7. [Prioritization (P0/P1/P2)](#prioritization)
8. [Success Metrics](#success-metrics)
9. [Open Questions](#open-questions)

---

## Problem Statement

### The Problem

Multi-agent AI systems are powerful but inaccessible. Today, setting up a team of AI agents requires:

- Editing JSON configuration files by hand
- Writing SOUL.md personality files in markdown
- Understanding routing rules and model selection
- Managing API keys across multiple services
- Setting up cron jobs via command line
- Debugging silent failures with no feedback

**This locks out 95% of potential users** - the small business owner who wants AI help but doesn't know what "JSON" means, the family who wants a shared assistant but can't SSH into a server, the creator who knows exactly what personality they want but can't express it in config syntax.

### Why It Matters

The AI assistant market is exploding, but solutions fall into two buckets:

1. **Consumer apps** (ChatGPT, Claude.ai) - Easy but generic. One-size-fits-all personality. No customization. No multi-agent coordination.

2. **Developer tools** (Moltbot CLI, AutoGPT) - Powerful but technical. Config files, terminals, debugging. Requires engineering skills.

**There's a massive gap in the middle**: powerful multi-agent AI that normal people can set up and customize.

### Our Opportunity

ClawCrew already has the backend power - the CLI tool works. What we're missing is the front door. The web app is that front door: **"What if setting up an AI team was as easy as filling out a form?"**

### Why Teams Beat Single Agents

Competitors offer "set up your AI assistant." We offer "build your AI team."

The difference matters:

| Single Agent | Multi-Agent Team |
|--------------|------------------|
| One personality fits all | Specialist for each job |
| Context overload | Focused expertise |
| Jack of all trades, master of none | Right tool for right job |
| Generic responses | Role-appropriate tone |
| No collaboration | Agents hand off and review each other |

Example: A single agent asked to "write code and then review it" will inevitably approve its own work. A team with separate Engineer and Coordinator agents provides actual checks and balances.

---

## User Personas

### Persona 1: Sarah - Small Business Owner

**Demographics:** 42, owns a boutique marketing agency, 5 employees  
**Technical Level:** Uses Canva, Slack, Google Workspace. Never touched a terminal.  
**Goals:**
- Automate repetitive client communication
- Get help with content creation
- Daily briefings on what needs attention

**Frustrations:**
- Tried ChatGPT but it feels generic
- Looked at "AI automation" tools but they all require coding
- Doesn't have time to learn new technical skills

**How ClawCrew Helps:**
Sarah sets up a 3-agent team in 20 minutes:
- **Support agent** handles initial client inquiries via email
- **Writer agent** drafts blog posts and social content  
- **Coordinator** sends her a morning briefing and routes urgent items

**Quote:** *"I don't need to understand how it works. I just need it to work."*

---

### Persona 2: Marcus - Tech-Curious Family Dad

**Demographics:** 35, product manager at a tech company, two kids  
**Technical Level:** Comfortable with apps, dabbled in no-code tools, intimidated by actual coding  
**Goals:**
- Family calendar and reminder management
- Help kids with homework questions
- Automate household coordination

**Frustrations:**
- Generic AI assistants don't know his family's context
- Setting up home automation is always harder than promised
- Privacy concerns with cloud-only solutions

**How ClawCrew Helps:**
Marcus runs ClawCrew locally on his home server:
- **Scheduler agent** manages family reminders and calendar
- **Researcher agent** helps with homework (with age-appropriate responses)
- **Coordinator** handles the family group chat

**Quote:** *"I want an AI that knows my family isn't some generic 'family.' We have our own quirks."*

---

### Persona 3: Jordan - Content Creator

**Demographics:** 28, YouTube creator (150K subscribers), also does podcast and newsletter  
**Technical Level:** Uses editing software, social media tools, automation via Zapier  
**Goals:**
- Consistent content across platforms
- Research assistance for video topics
- Manage community engagement

**Frustrations:**
- Spends more time on admin than creating
- AI-generated content sounds robotic and generic
- Each platform needs different tone and format

**How ClawCrew Helps:**
Jordan builds a content team:
- **Researcher** digs into video topics and summarizes sources
- **Writer** adapts content for newsletter vs Twitter vs YouTube descriptions
- **Creative** helps with thumbnail concepts and titles
- All share context about Jordan's brand voice and audience

**Quote:** *"I don't want AI that writes FOR me. I want AI that thinks WITH me."*

---

### Persona 4: Dev (Edge Case) - Technical User Who Wants GUI Sometimes

**Demographics:** 32, software engineer, already uses Moltbot CLI  
**Technical Level:** High. Could do everything in config files.  
**Goals:**
- Quick visual overview of agent setup
- Onboard less-technical family members to shared system
- Rapid prototyping before committing to config

**Frustrations:**
- Config files are powerful but slow to iterate on
- Hard to visualize routing rules in YAML
- Sharing setup with non-technical users is painful

**How ClawCrew Helps:**
Dev uses the web app for:
- Visual routing rule builder (then exports to config)
- Giving family members a dashboard without terminal access
- Quick SOUL.md editing with preview

**Quote:** *"Sometimes I just want to drag and drop instead of typing YAML for the 500th time."*

---

## Competitive Analysis

### SimpleClaw
- **What they offer:** Single agent setup wizard
- **Strengths:** Very polished onboarding, good for beginners
- **Weaknesses:** No multi-agent support, limited customization, cloud-only
- **Our advantage:** Teams, local-first option, deeper personality customization

### Clawi.ai
- **What they offer:** AI assistant builder with integrations
- **Strengths:** Many pre-built integrations, nice UI
- **Weaknesses:** Single agent model, expensive at scale, no local option
- **Our advantage:** Multi-agent collaboration, open architecture, runs anywhere

### ChatGPT / Claude (consumer)
- **What they offer:** General-purpose AI chat
- **Strengths:** Best models, easiest to start
- **Weaknesses:** No customization, no multi-agent, no channel integration
- **Our advantage:** Full customization, works in your existing channels

### Positioning Statement

> ClawCrew is the only AI setup tool that lets you build a **team** of specialized agents - not just one assistant - without writing any code. Run it locally or hosted, connect to any channel, and customize every personality.

---

## Feature Breakdown

### Feature 1: Crew Builder

The core interface for creating and managing your agent team.

#### 1.1 Agent Gallery

**Description:** Browse and add agents from pre-built templates or create blank.

**Pre-built Templates:**

| Template | Role | Default Model | Suggested Triggers |
|----------|------|---------------|-------------------|
| Coordinator | Routes requests, reviews work, manages handoffs | Opus | Default/fallback |
| Engineer | Code, technical implementation, debugging | Sonnet | "build", "code", "fix", "implement" |
| Researcher | Deep analysis, PRDs, technical writing | Opus | "research", "analyze", "investigate" |
| Creative | Images, design concepts, visual ideas | Sonnet + DALL-E | "design", "image", "create visual" |
| Scheduler | Cron jobs, reminders, time-based tasks | Sonnet | "remind", "schedule", "every day" |
| Writer | Blog posts, emails, documentation | Sonnet | "write", "draft", "compose" |
| Analyst | Data analysis, reports, insights | Opus | "analyze data", "report", "metrics" |
| Support | Customer communication, FAQs, help | Sonnet | "help", "support", "question about" |

**Acceptance Criteria:**
- [ ] User can view all templates in a visual grid
- [ ] Each template shows: name, description, suggested use cases, default model
- [ ] User can click "Add to Crew" to add template to their team
- [ ] User can click "Start Blank" to create custom agent
- [ ] Templates can be customized after adding (not locked)

---

#### 1.2 Agent Editor

**Description:** Edit individual agent configuration with rich UI.

**Sections:**

**Basic Info**
- Name (text input)
- Avatar (upload or select from library)
- Short description (one-liner)
- Role tag (Coordinator/Engineer/etc. - affects UI color coding)

**Personality (SOUL.md)**
- Rich text editor with markdown preview
- Pre-populated sections:
  - Who You Are
  - Your Communication Style
  - Your Capabilities
  - Your Boundaries
- "Generate from description" button (AI writes SOUL.md from plain English)
- Character count and estimated token usage

**Model Configuration**
- Primary model dropdown (Opus/Sonnet/Haiku/GPT-4/etc.)
- "Use this model for" explanation text
- Temperature slider (0.0 - 1.0) with presets (Precise/Balanced/Creative)
- Max tokens slider
- "Advanced" expandable: system prompt prefix, stop sequences

**Routing Rules**
- "This agent handles messages that..." 
- Keyword triggers (pill input)
- Regex patterns (advanced, collapsible)
- Channel-specific rules (e.g., "only in Telegram")
- Priority number (lower = checked first)
- "Always review" toggle (sends to Coordinator before responding)

**Acceptance Criteria:**
- [ ] All fields save on change (autosave with indicator)
- [ ] SOUL.md preview renders markdown correctly
- [ ] Model selection shows estimated cost per message
- [ ] Routing rules have "Test" button with sample input
- [ ] Invalid config shows inline errors, blocks save
- [ ] "Revert to template" option available

---

#### 1.3 Crew Overview

**Description:** Visual representation of entire agent team and their relationships.

**Display:**
- Card grid showing all agents
- Visual indicators: active/inactive, last active time
- Drag-and-drop to reorder (affects fallback priority)
- Connection lines showing routing relationships
- Quick actions: Enable/Disable, Edit, Duplicate, Delete

**Crew Statistics:**
- Total agents count
- Estimated monthly cost (based on model selection and projected usage)
- Coverage analysis ("These message types have no handler...")

**Acceptance Criteria:**
- [ ] Overview updates in real-time as agents are edited
- [ ] Agents can be enabled/disabled with one click
- [ ] Deleting agent requires confirmation
- [ ] "Export Crew" downloads moltbot.json + all SOUL.md files
- [ ] "Import Crew" accepts exported bundle

---

### Feature 2: Channel Connections

Connect your agent team to messaging platforms.

#### 2.1 Channel Library

**Supported Channels:**

| Channel | Setup Complexity | Notes |
|---------|------------------|-------|
| Telegram | Easy | Bot token from BotFather |
| Discord | Medium | Bot application + permissions |
| WhatsApp | Medium | WhatsApp Business API or bridge |
| Signal | Hard | Requires signal-cli setup |
| Slack | Medium | Workspace app install |
| Email (IMAP) | Medium | App passwords, IMAP settings |
| Web Chat | Easy | Embedded widget |
| SMS (Twilio) | Medium | Twilio account + number |

**Acceptance Criteria:**
- [ ] Each channel has dedicated setup wizard
- [ ] Wizard explains requirements before starting
- [ ] Progress saves between steps (can resume later)
- [ ] Clear error messages with troubleshooting links

---

#### 2.2 Channel Setup Wizard (Example: Telegram)

**Step 1: Introduction**
- "You'll need: A Telegram account"
- "This will take: ~5 minutes"
- "What you'll get: Your agents respond in Telegram DMs and groups"

**Step 2: Create Bot**
- Instructions with screenshots: Open @BotFather, /newbot, copy token
- Embedded video option
- "I have my token" button

**Step 3: Enter Token**
- Secure token input field (masked)
- "Test Connection" button
- Success: Shows bot name, username
- Failure: Specific error (invalid token, network issue, etc.)

**Step 4: Configure**
- Which agents respond here? (multi-select)
- Allow groups? (toggle)
- Admin users (who can configure via chat)

**Step 5: Done**
- "Send a test message" deep link to bot
- Quick test: Type "hello" and see response

**Acceptance Criteria:**
- [ ] Each channel has similar wizard structure
- [ ] Tokens stored securely (encrypted at rest)
- [ ] "Test Connection" gives pass/fail with details
- [ ] Can edit configuration after initial setup
- [ ] Can disconnect channel (with confirmation)

---

#### 2.3 Connection Status Dashboard

**Display:**
- All connected channels in a list
- Status indicator: Connected (green), Error (red), Disabled (gray)
- Last message received timestamp
- Message count (24h / 7d / 30d)
- Quick actions: Test, Edit, Disable, Remove

**Alerts:**
- Connection lost notification
- Token expiring warning (where applicable)
- Rate limit approaching

**Acceptance Criteria:**
- [ ] Status refreshes automatically (polling or websocket)
- [ ] Clicking error shows detailed diagnostics
- [ ] "Test" sends a test message and confirms receipt
- [ ] Historical uptime visible (last 30 days)

---

### Feature 3: Schedule Manager

Create and manage automated tasks and briefings.

#### 3.1 Schedule List

**Display:**
- All scheduled tasks in sortable table
- Columns: Name, Agent, Schedule (human readable), Next Run, Status
- Quick toggle enable/disable
- Filter by agent, by type

**Acceptance Criteria:**
- [ ] Schedules show next 3 run times on hover
- [ ] Can duplicate existing schedule
- [ ] Bulk enable/disable selection

---

#### 3.2 Schedule Creator

**Types of Schedules:**

**Briefing**
- Summary of recent activity/news/tasks
- Templates: Morning Briefing, Evening Recap, Weekly Summary
- Customizable sections

**Reminder**
- One-time or recurring message
- "Remind me to X at Y"
- Can include context/attachments

**Task**
- Agent performs action automatically
- Examples: "Check website uptime", "Summarize inbox", "Post to Twitter"

**Visual Cron Builder:**
- Frequency: Once / Daily / Weekly / Monthly / Custom
- Time picker (with timezone)
- "Custom" reveals: visual cron expression builder
- Preview: "Runs every day at 9:00 AM Eastern"

**Acceptance Criteria:**
- [ ] Non-technical users never see raw cron syntax
- [ ] Preview shows next 5 occurrences
- [ ] Can set start/end dates
- [ ] Timezone explicitly shown and configurable
- [ ] "Test Run Now" executes immediately for testing

---

#### 3.3 Briefing Builder

**Sections Available:**
- Calendar summary (today's events)
- Weather
- News headlines (configurable topics)
- Task/reminder list
- Custom agent query ("Ask Researcher for...")
- Recent activity summary

**Delivery Options:**
- Which channel(s) to deliver to
- Mention/notification settings
- Format: Detailed / Summary / Bullet points

**Acceptance Criteria:**
- [ ] Drag-and-drop section ordering
- [ ] Preview shows example output
- [ ] Can save as template for reuse
- [ ] Delivery confirmation visible in activity log

---

### Feature 4: Activity Dashboard

See what your agents are doing.

#### 4.1 Activity Feed

**Display:**
- Real-time feed of agent activity
- Entry types: Message received, Response sent, Handoff, Error, Schedule executed
- Filterable by: Agent, Channel, Time range, Type
- Searchable by content

**Entry Detail:**
- Timestamp
- Agent involved (with avatar)
- Channel source
- Input (user message)
- Output (agent response)
- Token count
- Processing time
- "View full conversation" link

**Acceptance Criteria:**
- [ ] Feed updates in real-time
- [ ] Clicking entry expands full detail
- [ ] Can export feed as CSV/JSON
- [ ] Retention settings configurable (default 30 days)

---

#### 4.2 Conversation View

**Display:**
- Chat-style view of full conversation
- Shows which agent handled each message
- Handoffs visible ("Passed to Engineer...")
- User messages vs agent messages clearly distinguished

**Actions:**
- "Continue as human" - take over conversation
- "Regenerate" - have agent retry response
- "Flag" - mark for review
- "Add note" - internal annotation

**Acceptance Criteria:**
- [ ] Conversations grouped by session/user
- [ ] Can search within conversation
- [ ] Mobile-responsive design

---

#### 4.3 Analytics

**Metrics:**
- Messages per day (chart)
- Response time (average, p95)
- Token usage by agent (chart)
- Cost estimate (current billing period)
- Agent utilization (% of messages each handles)
- Error rate

**Insights:**
- "Busiest hours" heatmap
- "Most common topics" word cloud
- "Suggested improvements" (AI-generated)

**Acceptance Criteria:**
- [ ] Charts are interactive (hover for details)
- [ ] Date range selector
- [ ] Export data as CSV
- [ ] Cost projections for current trajectory

---

### Feature 5: Settings

Global configuration and administration.

#### 5.1 API Keys

**Supported Providers:**
- Anthropic (Claude models)
- OpenAI (GPT models, DALL-E)
- Google (Gemini)
- Mistral
- Local models (Ollama endpoint)

**Interface:**
- Secure input (masked after save)
- "Test Key" validation
- Last used timestamp
- Usage quota display (where API provides)

**Acceptance Criteria:**
- [ ] Keys encrypted at rest
- [ ] Invalid key shows clear error
- [ ] Can have multiple keys per provider (for billing separation)
- [ ] "Rotate key" workflow (add new before removing old)

---

#### 5.2 Model Defaults

**Settings:**
- Default model for new agents
- Fallback model (if primary unavailable)
- Cost limit (daily/monthly cap)
- Rate limiting (max requests per minute)

**Acceptance Criteria:**
- [ ] Cost limit triggers warning at 80%, stops at 100%
- [ ] Override per-agent available
- [ ] Model availability indicator (API status)

---

#### 5.3 Import/Export

**Export Options:**
- Full configuration (JSON bundle)
- Individual agent (SOUL.md + config)
- Schedules only
- Channels only (tokens redacted)

**Import Options:**
- From file upload
- From URL (for sharing)
- Merge vs Replace options

**Acceptance Criteria:**
- [ ] Export is fully portable (can import on fresh install)
- [ ] Import validates before applying
- [ ] Preview changes before confirming import
- [ ] Conflict resolution UI (when merging)

---

#### 5.4 User Management (Multi-user mode)

**Roles:**
- Admin: Full access
- Operator: Can use agents, view activity, edit schedules. Cannot edit agents or channels.
- Viewer: Read-only access to dashboard

**Features:**
- Invite by email
- Role assignment
- Activity audit log
- Remove user

**Acceptance Criteria:**
- [ ] Single-user mode default (no login required)
- [ ] Multi-user mode opt-in
- [ ] Simple auth (email + password) or OAuth (Google, GitHub)
- [ ] Audit log shows who changed what

---

## Wireframes

### Wireframe 1: Crew Builder - Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ClawCrew                    [Dashboard] [Crew] [Channels] [Schedules]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   Your Crew (4 agents)                              [+ Add Agent]       │
│                                                                         │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│   │  🎭         │  │  🔧         │  │  📚         │  │  ✍️          │   │
│   │ Coordinator │  │  Engineer   │  │ Researcher  │  │   Writer    │   │
│   │             │  │             │  │             │  │             │   │
│   │ Routes &    │  │ Code &      │  │ Analysis &  │  │ Content &   │   │
│   │ reviews     │  │ builds      │  │ research    │  │ drafts      │   │
│   │             │  │             │  │             │  │             │   │
│   │ ● Active    │  │ ● Active    │  │ ● Active    │  │ ○ Disabled  │   │
│   │ Opus        │  │ Sonnet      │  │ Opus        │  │ Sonnet      │   │
│   │             │  │             │  │             │  │             │   │
│   │ [Edit]      │  │ [Edit]      │  │ [Edit]      │  │ [Edit]      │   │
│   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                                         │
│   ─────────────────────────────────────────────────────────────────    │
│                                                                         │
│   Crew Stats                                                            │
│   ┌─────────────────────────────────────────────────────────────┐      │
│   │  Monthly cost estimate: ~$45    │  Messages (30d): 1,247    │      │
│   │  Coverage: ✓ All routes handled │  Avg response: 2.3s       │      │
│   └─────────────────────────────────────────────────────────────┘      │
│                                                                         │
│   [Export Crew]  [Import Crew]                                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Wireframe 2: Agent Editor

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ClawCrew  ›  Crew  ›  Edit: Researcher                    [← Back]     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────────────┬───────────────────────────────────────────┐  │
│   │                     │                                           │  │
│   │  Basic Info         │  Preview                                  │  │
│   │  ─────────────      │  ────────                                 │  │
│   │                     │                                           │  │
│   │  Name:              │  ┌─────────────────────────────────────┐  │  │
│   │  ┌───────────────┐  │  │ 📚 Researcher                       │  │  │
│   │  │ Researcher    │  │  │                                     │  │  │
│   │  └───────────────┘  │  │ "I am a research specialist who     │  │  │
│   │                     │  │  digs deep into topics..."          │  │  │
│   │  Avatar: [📚 ▼]     │  │                                     │  │  │
│   │                     │  │ Model: Claude Opus                  │  │  │
│   │  Role: [Researcher▼]│  │ Triggers: research, analyze, why... │  │  │
│   │                     │  │                                     │  │  │
│   │                     │  └─────────────────────────────────────┘  │  │
│   ├─────────────────────┤                                           │  │
│   │                     │                                           │  │
│   │  Personality        │                                           │  │
│   │  (SOUL.md)          │                                           │  │
│   │  ─────────────      │                                           │  │
│   │                     │                                           │  │
│   │  ┌───────────────────────────────────────────────────────────┐  │  │
│   │  │ # Who You Are                                             │  │  │
│   │  │                                                           │  │  │
│   │  │ You are a research specialist who digs deep into topics,  │  │  │
│   │  │ synthesizes information from multiple sources, and        │  │  │
│   │  │ presents findings in clear, structured formats.           │  │  │
│   │  │                                                           │  │  │
│   │  │ ## Communication Style                                    │  │  │
│   │  │                                                           │  │  │
│   │  │ - Thorough but not verbose                                │  │  │
│   │  │ - Cite sources when making claims                         │  │  │
│   │  │ - Structure with headers and bullets                      │  │  │
│   │  │ - Acknowledge uncertainty                                 │  │  │
│   │  │                                                           │  │  │
│   │  └───────────────────────────────────────────────────────────┘  │  │
│   │                                                                 │  │
│   │  [Generate from description...]                                 │  │
│   │                                                                 │  │
│   ├─────────────────────────────────────────────────────────────────┤  │
│   │                                                                 │  │
│   │  Model                          Routing                         │  │
│   │  ─────                          ───────                         │  │
│   │                                                                 │  │
│   │  Model: [Claude Opus ▼]         Triggers:                       │  │
│   │                                 ┌─────────────────────────────┐ │  │
│   │  Temperature: ━━━●━━━ 0.5       │ research │ analyze │ why │+ │ │  │
│   │               Precise  Creative └─────────────────────────────┘ │  │
│   │                                                                 │  │
│   │  Est. cost: $0.04/message       Priority: [ 2 ]                 │  │
│   │                                                                 │  │
│   │                                 [Test routing...]               │  │
│   │                                                                 │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│   [Revert to Template]                              [Delete Agent]      │
│                                                     ✓ Saved             │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Wireframe 3: Channel Connection Wizard

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ClawCrew  ›  Channels  ›  Connect Telegram                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ● Step 1    ○ Step 2    ○ Step 3    ○ Done                           │
│   Create Bot    Enter Token   Configure   Complete                      │
│   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                   │
│                                                                         │
│                                                                         │
│   📱 Create Your Telegram Bot                                          │
│   ──────────────────────────                                           │
│                                                                         │
│   1. Open Telegram and search for @BotFather                           │
│                                                                         │
│   2. Send the command: /newbot                                         │
│                                                                         │
│   3. Follow the prompts:                                               │
│      - Give your bot a name (e.g., "My ClawCrew Bot")                  │
│      - Give it a username ending in "bot" (e.g., "myclawcrew_bot")     │
│                                                                         │
│   4. BotFather will give you a token that looks like:                  │
│      123456789:ABCdefGHIjklMNOpqrsTUVwxyz                               │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │  [IMAGE: Screenshot of BotFather conversation]                  │  │
│   │                                                                 │  │
│   │  ▶ Watch 1-minute video tutorial                               │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│                                                                         │
│   ⓘ  Your token is private. Never share it publicly.                   │
│                                                                         │
│                                                                         │
│                                              [I have my token →]        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Wireframe 4: Schedule Manager

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ClawCrew                    [Dashboard] [Crew] [Channels] [Schedules]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   Schedules                                            [+ New Schedule] │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │ ✓ │ Name              │ Agent       │ When              │ Next  │  │
│   ├───┼───────────────────┼─────────────┼───────────────────┼───────┤  │
│   │ ✓ │ Morning Briefing  │ Coordinator │ Daily 8:00 AM     │ 6h    │  │
│   │ ✓ │ Weekly Summary    │ Analyst     │ Mon 9:00 AM       │ 3d    │  │
│   │ ○ │ Uptime Check      │ Engineer    │ Every 15 min      │ -     │  │
│   │ ✓ │ Newsletter Draft  │ Writer      │ Thu 2:00 PM       │ 5d    │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│   ─────────────────────────────────────────────────────────────────    │
│                                                                         │
│   Edit: Morning Briefing                                                │
│                                                                         │
│   Type: [Briefing ▼]              Agent: [Coordinator ▼]               │
│                                                                         │
│   Schedule                                                              │
│   ────────                                                              │
│   Frequency: [Daily ▼]                                                  │
│                                                                         │
│   Time: [8:00 AM ▼]    Timezone: [Eastern (ET) ▼]                      │
│                                                                         │
│   Preview: "Runs every day at 8:00 AM Eastern"                         │
│   Next 3: Jan 15 8:00 AM, Jan 16 8:00 AM, Jan 17 8:00 AM               │
│                                                                         │
│   Briefing Sections                                                     │
│   ─────────────────                                                     │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │ ≡ │ 📅 Today's Calendar                               [Remove] │  │
│   │ ≡ │ ☀️  Weather                                        [Remove] │  │
│   │ ≡ │ 📰 News Headlines (topics: tech, AI)              [Remove] │  │
│   │ ≡ │ ✅ Task List                                       [Remove] │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│   [+ Add Section]                                                       │
│                                                                         │
│   Deliver to: [Telegram ▼]                                              │
│                                                                         │
│   [Test Run Now]                                      [Save Changes]    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Wireframe 5: Activity Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ClawCrew                    [Dashboard] [Crew] [Channels] [Schedules]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   Activity                                    [Filter ▼]  [Search 🔍]   │
│                                                                         │
│   ┌──────────────────────────────────┬────────────────────────────────┐│
│   │ Today                            │  Quick Stats                   ││
│   │ ────────────────────────────     │  ───────────                   ││
│   │                                  │                                ││
│   │ 2:34 PM  📚 Researcher           │  Messages today: 47            ││
│   │ Telegram • Dave                  │  Tokens used: 12,450           ││
│   │ "Can you research the latest..." │  Est. cost: $0.87              ││
│   │ ✓ Responded (2.1s)               │                                ││
│   │                                  │  ┌────────────────────────┐   ││
│   │ 2:15 PM  🎭 Coordinator          │  │ ████████░░░ 75%        │   ││
│   │ Discord • Sarah                  │  │ Daily budget remaining │   ││
│   │ "What's the status on..."        │  └────────────────────────┘   ││
│   │ → Handed off to Engineer         │                                ││
│   │                                  │  Top agents:                   ││
│   │ 2:02 PM  🔧 Engineer             │  Coordinator  45%              ││
│   │ Discord • Sarah                  │  Researcher   30%              ││
│   │ "Build a script that..."         │  Engineer     25%              ││
│   │ ✓ Responded (4.7s)               │                                ││
│   │                                  │                                ││
│   │ 1:45 PM  ⏰ Scheduler            │                                ││
│   │ [Scheduled Task]                 │                                ││
│   │ "Morning Briefing executed"      │                                ││
│   │ ✓ Delivered to Telegram          │                                ││
│   │                                  │                                ││
│   │ [Load more...]                   │                                ││
│   │                                  │                                ││
│   └──────────────────────────────────┴────────────────────────────────┘│
│                                                                         │
│   ─────────────────────────────────────────────────────────────────    │
│   Expanded: Researcher @ 2:34 PM                                        │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │ User (Dave via Telegram):                                       │  │
│   │ "Can you research the latest developments in local LLMs?"       │  │
│   │                                                                 │  │
│   │ 📚 Researcher:                                                  │  │
│   │ "I'll look into recent local LLM developments. Here's what I   │  │
│   │  found:                                                         │  │
│   │                                                                 │  │
│   │  ## Recent Developments (Jan 2025)                              │  │
│   │  - Llama 3.2 released with improved efficiency..."              │  │
│   │                                                                 │  │
│   │ Tokens: 847 in / 1,203 out  •  Time: 2.1s  •  Model: Opus      │  │
│   │                                                                 │  │
│   │ [View Full Conversation]  [Regenerate]  [Flag for Review]       │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ClawCrew Web App                             │
│                         (Next.js Frontend)                          │
│                                                                     │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │
│   │ Crew Builder│  │  Channels   │  │  Schedules  │  │ Activity │ │
│   └─────────────┘  └─────────────┘  └─────────────┘  └──────────┘ │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       ClawCrew API Server                           │
│                      (Next.js API Routes)                           │
│                                                                     │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │
│   │Config CRUD  │  │ Channel Mgmt│  │Schedule CRUD│  │ Activity │ │
│   │             │  │  + Testing  │  │  + Execute  │  │  Stream  │ │
│   └─────────────┘  └─────────────┘  └─────────────┘  └──────────┘ │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
┌───────────────────────────┐  ┌─────────────────────────────────────┐
│    Config Files           │  │         Moltbot Daemon              │
│   (moltbot.json, SOUL.md) │  │   (existing installation)           │
│                           │  │                                     │
│   /config/                │  │   - Handles actual messaging        │
│     moltbot.json          │◄─┼─► - Executes scheduled tasks        │
│     agents/               │  │   - Routes to AI providers          │
│       coordinator.soul.md │  │   - Maintains connections           │
│       researcher.soul.md  │  │                                     │
│       engineer.soul.md    │  └─────────────────────────────────────┘
│                           │
└───────────────────────────┘
```

### Tech Stack

**Frontend:**
- Next.js 14+ (App Router)
- React 18
- Tailwind CSS + shadcn/ui components
- React Query (data fetching)
- Zustand (client state)
- Monaco Editor (SOUL.md editing)
- Framer Motion (animations)

**Backend:**
- Next.js API Routes
- Node.js runtime
- SQLite (local mode) or PostgreSQL (hosted mode)
- JSON file system (config persistence)
- node-cron (schedule execution)

**Infrastructure:**
- Local: Runs on same machine as Moltbot
- Hosted: Vercel/Railway/self-hosted Docker
- Config sync: Filesystem watch + webhook to Moltbot

### Data Models

```typescript
// Agent configuration
interface Agent {
  id: string;
  name: string;
  avatar: string;
  role: 'coordinator' | 'engineer' | 'researcher' | 'creative' | 
        'scheduler' | 'writer' | 'analyst' | 'support' | 'custom';
  enabled: boolean;
  soulMd: string;
  model: {
    provider: 'anthropic' | 'openai' | 'google' | 'local';
    model: string;
    temperature: number;
    maxTokens: number;
  };
  routing: {
    priority: number;
    keywords: string[];
    patterns: string[];
    channels: string[];
    alwaysReview: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Channel connection
interface Channel {
  id: string;
  type: 'telegram' | 'discord' | 'whatsapp' | 'signal' | 'slack' | 
        'email' | 'webchat' | 'sms';
  name: string;
  enabled: boolean;
  config: Record<string, string>; // type-specific config
  agents: string[]; // agent IDs that respond here
  status: 'connected' | 'error' | 'disabled';
  lastActivity: Date;
  createdAt: Date;
}

// Scheduled task
interface Schedule {
  id: string;
  name: string;
  type: 'briefing' | 'reminder' | 'task';
  agentId: string;
  enabled: boolean;
  cron: string;
  timezone: string;
  config: BriefingConfig | ReminderConfig | TaskConfig;
  deliverTo: string[]; // channel IDs
  lastRun: Date | null;
  nextRun: Date;
  createdAt: Date;
}

// Activity entry
interface Activity {
  id: string;
  timestamp: Date;
  type: 'message' | 'response' | 'handoff' | 'schedule' | 'error';
  agentId: string | null;
  channelId: string | null;
  userId: string | null;
  input: string | null;
  output: string | null;
  metadata: {
    tokensIn: number;
    tokensOut: number;
    processingTime: number;
    model: string;
  };
}
```

### File Generation

The web app generates standard Moltbot configuration files:

**moltbot.json (simplified example):**
```json
{
  "agents": {
    "coordinator": {
      "soul": "./agents/coordinator.soul.md",
      "model": "claude-opus-4-0-20250514",
      "routing": {
        "priority": 0,
        "default": true
      }
    },
    "researcher": {
      "soul": "./agents/researcher.soul.md", 
      "model": "claude-opus-4-0-20250514",
      "routing": {
        "priority": 1,
        "keywords": ["research", "analyze", "investigate"]
      }
    }
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "{{TELEGRAM_TOKEN}}"
    }
  },
  "schedules": {
    "morning-briefing": {
      "cron": "0 8 * * *",
      "agent": "coordinator",
      "action": "briefing",
      "deliverTo": ["telegram"]
    }
  }
}
```

### API Endpoints

```
# Agents
GET    /api/agents           - List all agents
POST   /api/agents           - Create agent
GET    /api/agents/:id       - Get agent details
PUT    /api/agents/:id       - Update agent
DELETE /api/agents/:id       - Delete agent
POST   /api/agents/:id/test  - Test routing

# Channels
GET    /api/channels         - List all channels
POST   /api/channels         - Create channel
GET    /api/channels/:id     - Get channel details
PUT    /api/channels/:id     - Update channel
DELETE /api/channels/:id     - Delete channel
POST   /api/channels/:id/test - Test connection

# Schedules
GET    /api/schedules        - List all schedules
POST   /api/schedules        - Create schedule
GET    /api/schedules/:id    - Get schedule details
PUT    /api/schedules/:id    - Update schedule
DELETE /api/schedules/:id    - Delete schedule
POST   /api/schedules/:id/run - Execute now

# Activity
GET    /api/activity         - List activity (paginated)
GET    /api/activity/:id     - Get activity detail
GET    /api/activity/stream  - SSE stream for real-time
GET    /api/activity/stats   - Aggregate statistics

# Settings
GET    /api/settings         - Get all settings
PUT    /api/settings         - Update settings
POST   /api/settings/test-key - Validate API key
POST   /api/export           - Export configuration
POST   /api/import           - Import configuration
```

### Security Considerations

1. **API Key Storage:** Keys encrypted at rest using AES-256. Decrypted only when needed for API calls.

2. **Token Handling:** Channel tokens (Telegram, Discord) similarly encrypted. Never logged.

3. **Local Mode Security:** When running locally, can require local network only (no external access).

4. **Multi-user Authentication:** Optional OAuth or email/password auth. JWT sessions.

5. **CORS:** Strict same-origin in production. Configurable for development.

6. **Input Validation:** All user input validated. SOUL.md content sanitized for injection.

---

## Prioritization

### P0 - MVP (Launch)

Must have for initial release. Target: 6-8 weeks.

| Feature | Description | Why P0 |
|---------|-------------|--------|
| Agent Gallery | View and add from 4 templates (Coordinator, Engineer, Researcher, Writer) | Core value prop |
| Agent Editor - Basic | Name, SOUL.md text editing, model selection | Minimum customization |
| Telegram Connection | Full wizard + test | Most accessible channel |
| Discord Connection | Full wizard + test | Popular for tech users |
| Crew Overview | Card view, enable/disable | See your team |
| Activity Feed | Real-time list, basic filtering | Know it's working |
| Settings - API Keys | Anthropic + OpenAI key entry | Required to function |
| Export Config | Download moltbot.json bundle | Safety net |
| Local Mode | Run on localhost | Privacy-focused users |

**P0 delivers:** A working product where users can set up a 2-4 agent team, connect to Telegram or Discord, and see activity.

---

### P1 - Enhanced (Month 2-3)

Important but not blocking launch.

| Feature | Description | Why P1 |
|---------|-------------|--------|
| All 8 Agent Templates | Add Creative, Scheduler, Analyst, Support | Full template library |
| Schedule Manager | Create and manage scheduled tasks | Key use case |
| Briefing Builder | Visual briefing configuration | High demand |
| More Channels | WhatsApp, Slack, Email | Broader reach |
| Visual Routing Builder | Drag-drop routing rules | Easier than keywords |
| Analytics Dashboard | Charts, costs, usage trends | Power users want it |
| Import Config | Upload existing config | Migration path |
| Dark Mode | Theme toggle | User preference |

---

### P2 - Advanced (Month 4+)

Nice to have, can iterate based on feedback.

| Feature | Description | Why P2 |
|---------|-------------|--------|
| Multi-user Mode | Login, roles, audit log | Enterprise-adjacent |
| Hosted Mode | Deploy to Vercel/Railway | Convenience |
| Agent Marketplace | Share/download agent configs | Community |
| Signal, SMS Channels | Complex setup channels | Niche demand |
| AI-generated SOUL.md | "Generate personality from description" | Polish |
| Conversation View | Full chat history browser | Deep debugging |
| Mobile Responsive | Full mobile support | Secondary device |
| Webhooks | Trigger external services on events | Integrations |
| Custom Agent Types | Beyond 8 templates | Power users |

---

## Success Metrics

### Launch Metrics (P0)

| Metric | Target | How Measured |
|--------|--------|--------------|
| Setup completion rate | >70% | % who add at least 1 agent + 1 channel |
| Time to first message | <15 min | Time from install to first agent response |
| Active crews (7d) | Growing | Unique instances with activity |
| Error rate | <5% | Failed connection/response rate |

### Growth Metrics (P1+)

| Metric | Target | How Measured |
|--------|--------|--------------|
| Agents per crew | >2 avg | Average agents per installation |
| Channels per crew | >1.5 avg | Multi-channel adoption |
| Scheduled tasks | >1 avg | Automation adoption |
| Monthly active users | 1000+ | Unique users per month |
| NPS | >40 | User survey |

### Competitive Metrics

| Metric | Target | Comparison |
|--------|--------|------------|
| Setup time | 50% faster than CLI | Time comparison |
| Agent count | 2x competitor avg | SimpleClaw/Clawi comparison |
| Feature coverage | 80% of CLI features | Feature parity tracking |

---

## Open Questions

### Product Questions

1. **Hosting model:** Do we offer a hosted version (SaaS) or local-only initially?
   - Recommendation: Local-first MVP, hosted as P2

2. **Pricing:** Free forever? Freemium? Paid?
   - Recommendation: Free, open source. Premium hosted tier later.

3. **Crew sharing:** Can users share their crew configs publicly?
   - Recommendation: Export/import in P0, marketplace in P2

4. **Mobile app:** Native app or PWA?
   - Recommendation: Responsive web (PWA) is sufficient initially

### Technical Questions

1. **Moltbot integration:** Tight coupling or loose?
   - Recommendation: Loose - generate config files, let Moltbot handle runtime

2. **Real-time updates:** Polling or WebSocket?
   - Recommendation: SSE for activity feed, polling for status

3. **Database:** SQLite for local, what for hosted?
   - Recommendation: SQLite local, PostgreSQL hosted, Prisma ORM for both

4. **Auth provider:** Roll our own or use Clerk/Auth.js?
   - Recommendation: Auth.js for simplicity

### Design Questions

1. **Design system:** Custom or shadcn/ui?
   - Recommendation: shadcn/ui for speed, customize later

2. **Onboarding:** Wizard or exploration?
   - Recommendation: Optional guided wizard, can skip

3. **Help content:** In-app or docs site?
   - Recommendation: Tooltips + contextual help in-app, full docs separate

---

## Appendix

### A. SOUL.md Template Structure

```markdown
# Who You Are

[Core identity and purpose]

## Your Role

[Specific responsibilities in the crew]

## Communication Style

- [Tone guidelines]
- [Format preferences]
- [What to avoid]

## Your Capabilities

- [What you can do]
- [Tools you have access to]

## Your Boundaries

- [What you don't do]
- [When to hand off]

## Working With Others

- [How you collaborate with other agents]
- [Handoff protocols]
```

### B. Default Agent SOUL.md Examples

See `/templates/agents/` directory for full examples of each default agent type.

### C. Channel Setup Requirements

| Channel | Requirements | Complexity |
|---------|--------------|------------|
| Telegram | Telegram account, BotFather bot | Easy |
| Discord | Discord account, Developer Portal app, Bot permissions | Medium |
| WhatsApp | WhatsApp Business account, API access or bridge | Medium |
| Slack | Slack workspace admin, App creation | Medium |
| Signal | Phone number, signal-cli installation | Hard |
| Email | IMAP server access, app password | Medium |
| SMS | Twilio account, phone number, funds | Medium |

---

*Document maintained by Beast. Last updated January 2025.*
