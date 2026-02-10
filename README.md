# ClawCrew 🦞

**OpenClaw with personality.** A ready-to-run AI agent wrapper with pre-configured personas, skills, and workflows.

## What You Get

- **Gambit** 🃏 - Lead agent. Cajun card shark. Gets things done.
- **Pre-configured skills** - X research, mission control, marketing copy
- **One config file** - All your API keys in one place
- **Memory that works** - Structured daily notes, searchable
- **Mission control dashboard** - See what your agents are doing

## Quick Start

```bash
# Clone
git clone https://github.com/dave-melillo/clawcrew.git
cd clawcrew

# Configure (edit with your keys)
cp config.example.env config.env
nano config.env

# Install
./install.sh

# Run
openclaw
```

## Requirements

- [OpenClaw](https://openclaw.ai) installed
- Node.js 18+
- API keys: Anthropic, X (optional), Vercel (optional)

## What's Included

```
clawcrew/
├── personas/           # Agent personalities
│   └── gambit.md       # The Cajun
├── skills/             # Bundled capabilities
│   ├── x-research/     # Twitter/X research
│   └── mission-control/# Dashboard
├── templates/          # Workflow templates
│   ├── build.md        # Build something
│   ├── research.md     # Research a topic
│   └── ship.md         # Deploy to production
├── config.example.env  # API key template
└── install.sh          # One-command setup
```

## License

MIT
