# ClawCrew 🃏

**OpenClaw with personality.** Multi-agent crew orchestration made simple.

> "Bits gets you one OpenClaw. ClawCrew gets you a team."

## What is ClawCrew?

ClawCrew is a wrapper around [OpenClaw](https://openclaw.ai) that adds:
- **Pre-built agent crews** - X-Men, Startup, Content, and more
- **Personality system** - Agents with character, not just capabilities
- **Crew orchestration** - Agents that talk to each other
- **Mission Control** - Visual dashboard for your agent team
- **One-command setup** - From zero to working crew in minutes

## Quick Start

```bash
# Clone the repo
git clone https://github.com/dave-melillo/clawcrew.git
cd clawcrew

# Run the setup wizard
./bin/clawcrew init

# Check your crew
./bin/clawcrew status

# Open the dashboard
./bin/clawcrew dashboard
```

## The Crews

### 🃏 X-Men Crew
The original. Based on real production usage.
- **Gambit** 🃏 - Coordinator. Routes tasks, manages flow.
- **Beast** 🔬 - Researcher. Writes PRDs, analyzes problems.
- **Wolverine** 🐺 - Engineer. Builds features, ships code.
- **Magneto** 🧲 - QA. Validates work, maintains quality.

### 🚀 Startup Crew
Perfect for early-stage projects.
- **The Boss** 🎯 - Coordination
- **The Builder** ⚙️ - Engineering
- **The Brain** 🔍 - Research
- **The Artist** 🎨 - Creative

### 📝 Content Crew
For content-heavy workflows.
- **Coordinator** - Routes work
- **Writer** - Creates content
- **Researcher** - Finds facts
- **Creative** - Visual design

### 👤 Solo Crew
Just you and Gambit.

## Project Structure

```
clawcrew/
├── bin/clawcrew         # CLI entry point
├── lib/crew-engine.ts   # Orchestration core
├── personas/            # Agent personalities
├── skills/
│   ├── mission-control/ # Dashboard (Next.js)
│   └── x-research/      # Twitter/X research
├── templates/           # Workflow templates
├── webapp/              # Full web app (Next.js)
└── PRD.md               # Product spec
```

## Components

### CLI (`bin/clawcrew`)
Interactive setup wizard. Run `clawcrew init` to configure your crew.

### CrewEngine (`lib/crew-engine.ts`)
The orchestration core. Handles:
- Agent registry
- Message routing between agents
- Task delegation
- Crew templates

### Mission Control (`skills/mission-control/`)
Visual dashboard showing:
- Active tasks
- Agent status
- Backlog
- Completed work

### Web App (`webapp/`)
Full configuration UI with:
- Agent templates
- SOUL.md editor
- Channel configuration
- Export/import

## Development

```bash
# Install dependencies
npm install
cd webapp && npm install
cd ../skills/mission-control && npm install

# Run CLI
npm run cli

# Run dashboard
npm run dashboard

# Run full webapp
npm run webapp
```

## Configuration

All config stored in `~/.clawcrew/`:
- `config.json` - API keys, settings
- `crew.json` - Your agent crew

## Roadmap

- [x] CLI wizard
- [x] Crew templates (X-Men, Startup, Solo)
- [x] Mission Control dashboard
- [x] CrewEngine orchestration core
- [ ] Agent-to-agent messaging
- [ ] Real OpenClaw integration
- [ ] Danger Room visualization
- [ ] Cloud sync

## License

MIT

---

*Laissez les bons temps rouler.* 🃏
