# ClawCrew 🦀👥

**Build your AI agent team.** 

Don't just get an assistant. Get a crew.

ClawCrew makes it easy to set up multi-agent AI teams powered by OpenClaw/Moltbot. Create agents with distinct personalities, specialized skills, and coordinated workflows — all working together like a real team.

## Why ClawCrew?

Most AI assistant setups give you **one generic chatbot**.

ClawCrew gives you a **team**:
- 🃏 A coordinator who routes requests
- 🐺 A specialist who handles implementation
- 🔵 A researcher who digs deep
- 🔴 A creative who generates content
- ...and whoever else you need

Think of it like hiring a small ops team, except it costs a fraction and works 24/7.

## Quick Start

```bash
# Install
npm install -g clawcrew

# Create your first agent
clawcrew init

# Apply a persona template
clawcrew template personal-assistant

# Validate your setup
clawcrew validate
```

## Features

### 🎭 Persona Templates
Pre-built personalities for common use cases:
- **Personal Assistant** — Calendar, email, life organization
- **Family Manager** — Kid schedules, household coordination
- **Small Business** — Client follow-ups, invoicing, scheduling
- **Developer** — Code review, documentation, GitHub integration

### 👥 Multi-Agent Teams
Build coordinated agent teams:
- Each agent has their own personality (SOUL.md)
- Routing rules determine who handles what
- Shared workspace for context continuity
- Agents can delegate to each other

### 📱 Multi-Channel
Your agents live where you already are:
- Telegram
- WhatsApp
- Discord
- Signal
- iMessage (Mac)
- Slack
- And more...

### ⚡ Fast Setup
Traditional setup: 30+ minutes of SSH, Node.js, configuration.
ClawCrew: Under 5 minutes with guided wizard.

## Commands

```bash
clawcrew init              # Interactive setup wizard
clawcrew validate          # Check your configuration  
clawcrew template <name>   # Apply a persona template
clawcrew template --list   # List available templates
```

## The X-Men Model

ClawCrew is inspired by the "X-Men" approach to AI agents:

| Agent | Role | Specialty |
|-------|------|-----------|
| **Gambit** | Coordinator | Routes work, reviews output |
| **Wolverine** | Implementer | Code, builds, gets things done |
| **Beast** | Researcher | PRDs, analysis, deep thinking |
| **Cyclops** | Creative | Images, visual content |
| **Rogue** | Scheduler | Cron jobs, reminders, automation |

You define each agent's personality in their SOUL.md file. That's it. The magic is in the personas, not complex infrastructure.

## How It Works

1. **SOUL.md** — Defines who the agent IS (personality, voice, boundaries)
2. **USER.md** — Defines who they're HELPING (your profile, preferences)
3. **AGENTS.md** — Defines HOW they work (rules, memory, tools)
4. **Routing** — Determines which agent handles which requests

ClawCrew generates these files through an interactive wizard, or you can customize them yourself.

## Comparison

| Feature | Generic AI | Single Agent | ClawCrew |
|---------|------------|--------------|----------|
| Personality | ❌ | Basic | ✅ Rich, customizable |
| Multi-agent | ❌ | ❌ | ✅ Full team support |
| Context memory | ❌ | Basic | ✅ Shared workspace |
| Proactive | ❌ | Limited | ✅ Scheduled tasks |
| Multi-channel | ❌ | 1-2 | ✅ 10+ channels |

## Requirements

- Node.js 18+
- Moltbot/OpenClaw installed
- Anthropic API access (or Claude subscription)

## Documentation

- [Reference Implementation](REFERENCE-IMPLEMENTATION.md) — How a full setup looks
- [PRD](PRD.md) — Detailed product requirements
- [Templates](templates/) — Persona template files

## Contributing

PRs welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT

---

**Built for people who want AI that works like a team, not a search box.**
