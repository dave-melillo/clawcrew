# DataDeck Agent Kit - Reference Implementation

This document captures Dave Melillo's "Gambit" setup as the reference implementation for the DataDeck Agent Setup service.

---

## Infrastructure Overview

| Component | Value |
|-----------|-------|
| **Host** | Hetzner CX32 VPS (8GB RAM) |
| **OS** | Ubuntu 24.04 (Linux 6.8.0) |
| **Runtime** | Bun (via Moltbot) |
| **Moltbot Version** | 2026.1.27-beta.1 |
| **Auth** | Anthropic OAuth (Claude Max subscription) |
| **Timezone** | America/New_York |

---

## Agent Architecture

### Primary Agent: Gambit 🃏
- **Role:** Coordinator, main interface
- **Model:** Claude Opus 4.5 (default)
- **Workspace:** `/home/clawdbot/clawd`
- **Behavior:** Routes work to specialists, never codes directly

### Specialist Agents

| Agent | Emoji | Model | Specialty |
|-------|-------|-------|-----------|
| Wolverine | 🐺 | Sonnet 4.5 | Implementation, coding |
| Beast | 🔵 | Opus 4.5 | Research, PRDs, analysis |
| Cyclops | 🔴 | Sonnet 4.5 | Image generation |
| Professor X | 🧠 | Opus 4.5 | Strategy, architecture |
| Nightcrawler | 💨 | Sonnet 4.5 | Monitoring, alerts |
| Rogue | 🟢 | Sonnet 4.5 | Scheduling, automation |

### Agent Workspace Structure

Each agent has a dedicated workspace with these core files:

```
/home/clawdbot/clawd/           # Main workspace (Gambit)
├── AGENTS.md                   # Behavior instructions
├── SOUL.md                     # Personality definition
├── USER.md                     # User profile
├── IDENTITY.md                 # Agent identity
├── TOOLS.md                    # Tool-specific notes
├── MEMORY.md                   # Long-term curated memory
├── HEARTBEAT.md                # Heartbeat task checklist
├── memory/                     # Daily logs
│   ├── YYYY-MM-DD.md          # Daily notes
│   ├── backlog.md             # Task backlog
│   └── archive/               # Archived memories
├── tools/                      # Custom tools
├── scripts/                    # Automation scripts
└── bin/                        # CLI wrappers
```

---

## Channel Configuration

### Telegram (Primary)
```json
{
  "telegram": {
    "enabled": true,
    "dmPolicy": "allowlist",
    "allowFrom": ["USER_TELEGRAM_ID"],
    "groupPolicy": "allowlist",
    "streamMode": "partial"
  }
}
```

### Other Supported Channels
- Signal (via signal-cli)
- WhatsApp (via wacli)
- Discord
- iMessage (Mac only, via BlueBubbles)
- Slack
- SMS

---

## Memory & Context Management

### Memory Search
```json
{
  "memorySearch": {
    "provider": "gemini",
    "model": "gemini-embedding-001",
    "query": {
      "hybrid": {
        "enabled": true,
        "vectorWeight": 0.7,
        "textWeight": 0.3
      }
    }
  }
}
```

### Context Pruning
```json
{
  "contextPruning": {
    "mode": "cache-ttl",
    "ttl": "3m",
    "keepLastAssistants": 2,
    "minPrunableToolChars": 20000,
    "softTrim": {
      "maxChars": 2000,
      "headChars": 800,
      "tailChars": 800
    }
  }
}
```

### Compaction
```json
{
  "compaction": {
    "mode": "safeguard",
    "reserveTokensFloor": 15000,
    "memoryFlush": {
      "enabled": true,
      "softThresholdTokens": 5000
    }
  }
}
```

---

## Scheduled Tasks (Cron)

### Morning Briefing (8 AM daily)
- Calendar events
- Unread emails
- Trello tasks
- GitHub notifications
- Weather
- YouTube activity
- Delivers via Telegram

### Evening Wrap-up (7 PM Mon-Fri)
- Day summary
- Work notes (//gambit emails)
- Tomorrow preview
- Reflection prompts

### Rogue Patrol (Every 30 min, 8 AM - 10 PM)
- Background monitoring
- Alerts to main session when needed

### Work Calendar Reminder (9 AM Mon-Fri)
- Prompts for Outlook calendar screenshot

### Weekly Security Review (Saturdays)
- System audit
- Permission checks
- Token review

---

## Integrations

### Google Workspace (via gog CLI)
- Gmail
- Calendar
- Drive
- Sheets
- Docs
- Contacts

**Setup:** OAuth flow via `gog auth`, keyring password for automation

### GitHub (via gh CLI)
- Notifications
- Issues
- PRs
- API access

### Trello
- REST API with key/token
- Boards: Everyday, Consulting

### YouTube Music (via ytmusicapi)
- OAuth device flow
- Listening history for briefings

---

## Skills Installed

Key skills in use:
- `gog` - Google Workspace
- `github` - GitHub CLI
- `weather` - Forecasts
- `bitwarden` - Password management
- `himalaya` - Email via IMAP
- `tmux` - Terminal control
- `video-frames` - Video processing
- `coding-agent` - Claude Code integration

---

## Custom Tools

Located in `/home/clawdbot/clawd/tools/`:

| Tool | Purpose |
|------|---------|
| `prd-check` | Validates PRDs before implementation |
| `shadow-review` | Automated code review |
| `trail` | Trajectory tracking for decisions |

---

## What Makes This Work

### 1. Personality Files
The `SOUL.md` and `USER.md` files create a persistent identity that survives session restarts. The agent "knows" the user.

### 2. Memory System
Daily logs + curated MEMORY.md + semantic search = continuity across sessions.

### 3. Proactive Behavior
Heartbeats and cron jobs mean the agent works without being asked. It reaches out when relevant.

### 4. Multi-Agent Delegation
Gambit doesn't do everything. Specialists handle specialized work, keeping quality high.

### 5. Native Channels
Works in apps the user already uses (Telegram, WhatsApp, etc.), not a separate app.

---

## Replication Checklist

To replicate this setup for a new user:

1. [ ] Provision host (VPS or local machine)
2. [ ] Install Moltbot
3. [ ] Configure auth (Anthropic OAuth or API key)
4. [ ] Set up primary channel (Telegram recommended)
5. [ ] Create agent workspace with template files
6. [ ] Customize SOUL.md for user's personality preference
7. [ ] Fill USER.md with user profile
8. [ ] Configure integrations (Google, GitHub, etc.)
9. [ ] Set up briefing cron jobs
10. [ ] Test end-to-end flow
11. [ ] Train user on basics

---

## Time Estimates

| Phase | Estimated Time |
|-------|----------------|
| Infrastructure setup | 30-60 min |
| Moltbot installation | 15-30 min |
| Channel configuration | 30-60 min |
| Workspace setup | 30-60 min |
| Personality customization | 1-2 hours |
| Integration setup | 1-3 hours (varies) |
| Testing & polish | 1-2 hours |
| **Total** | **4-8 hours** |

With tooling, target: **Under 2 hours**

---

*This document is the baseline for the DataDeck Agent Kit tooling.*
