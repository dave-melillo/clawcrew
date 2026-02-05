# ClawCrew Web App - MVP

> Build your AI crew visually. No code required.

ClawCrew is a visual interface for building and managing multi-agent AI teams. While competitors offer single-agent setups, ClawCrew lets you create **teams** of specialized AI agents that work together - each with their own personality, skills, and focus.

## ✨ Features

### P0 MVP Features (Current Release)

- **🎭 Crew Builder** - Gallery view of 8 pre-built agent templates
  - Coordinator (The Boss) - Routes & reviews
  - Engineer (The Builder) - Code & implementation
  - Researcher (The Brain) - Analysis & research
  - Creative (The Artist) - Content & images
  - Scheduler (The Keeper) - Reminders & automation
  - Writer (The Wordsmith) - Docs & communication
  - Analyst (The Numbers) - Data & insights
  - Support (The Helper) - Customer communication

- **✏️ Agent Editor** - Full SOUL.md editor with:
  - Rich text editing for agent personality
  - Model selection (Claude Opus/Sonnet/Haiku, GPT-4/3.5)
  - Temperature slider for creativity control
  - Routing keywords configuration
  - Real-time preview

- **📱 Channel Connection** - Telegram wizard (5 minutes)
  - Step-by-step setup with instructions
  - Token validation and testing
  - Discord and more channels coming soon

- **📊 Activity Dashboard** - Real-time activity feed
  - Message history
  - Token usage tracking
  - Response time metrics
  - Cost estimation

- **💾 Export Config** - Generate moltbot.json + SOUL.md files
  - Full crew export
  - Ready to use with Moltbot CLI

### Coming Soon (P1)

- Schedule Manager (briefings, reminders, automated tasks)
- Discord connection wizard
- More channels (WhatsApp, Slack, Email)
- Analytics and insights
- Import configuration
- Dark mode toggle

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun

### Installation

1. **Clone or navigate to the project:**
```bash
cd /home/clawdbot/clawd/clawcrew/webapp
```

2. **Install dependencies:**
```bash
npm install
# or
bun install
```

3. **Run development server:**
```bash
npm run dev
# or
bun dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

### First Steps

1. **Add Your First Agent** - Click on any template card to add an agent to your crew
2. **Customize the Agent** - Click "Edit" to modify personality, model, and routing
3. **Connect a Channel** - Go to Channels → Connect Telegram
4. **Test It Out** - Message your bot on Telegram!

## 🎨 Design Philosophy

**Make it EASY and FUN!** This is for non-technical users.

- **Playful, not corporate** - Emojis, personality, character
- **Clean but fun** - Not a boring enterprise dashboard
- **Team building game feel** - Building your crew should be exciting
- **Personality-forward** - Show agent avatars, vibes, character

## 🏗️ Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui (Radix UI primitives)
- **State:** Zustand
- **Icons:** Lucide React

## 📁 Project Structure

```
webapp/
├── src/
│   ├── app/                # Next.js pages
│   │   ├── page.tsx        # Crew Builder (home)
│   │   ├── channels/       # Channel connections
│   │   ├── activity/       # Activity feed
│   │   └── schedules/      # Schedules (coming soon)
│   ├── components/         # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── nav.tsx         # Navigation
│   │   ├── agent-card.tsx  # Agent display card
│   │   ├── agent-editor.tsx # Agent editing interface
│   │   └── telegram-wizard.tsx # Telegram setup
│   ├── lib/
│   │   ├── store.ts        # Zustand state management
│   │   └── utils.ts        # Utility functions
│   ├── types/
│   │   └── index.ts        # TypeScript types
│   └── data/
│       └── agent-templates.ts # Pre-built agent templates
├── public/                 # Static assets
└── package.json
```

## 🎭 Agent Templates

Each template comes with:
- **Pre-written SOUL.md** - Complete personality definition
- **Default model** - Optimized for the agent's role
- **Suggested keywords** - For routing messages
- **Visual identity** - Emoji, color, vibe

You can use them as-is or customize everything!

## 💾 Export Format

The app generates standard Moltbot configuration:

**moltbot.json:**
```json
{
  "agents": {
    "coordinator": {
      "soul": "./agents/coordinator.soul.md",
      "model": "claude-opus-4",
      "routing": {
        "priority": 0,
        "default": true
      }
    }
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "{{TELEGRAM_TOKEN}}"
    }
  }
}
```

Plus individual `SOUL.md` files for each agent.

## 🔒 Security & Privacy

- **Local-first** - Runs on your machine, your data stays yours
- **No telemetry** - We don't track anything
- **Encrypted tokens** - Channel tokens stored securely
- **No external calls** - Except to AI providers you configure

## 🤝 Contributing

This is an MVP! Here's what would help:

- **Bug reports** - If something breaks, let us know
- **UX feedback** - Is it fun? Is it confusing? Tell us!
- **Feature requests** - What would make this more useful?
- **Agent templates** - Share your custom agents!

## 📝 Development Roadmap

### MVP (Current) ✅
- [x] Crew Builder with 8 templates
- [x] Agent Editor
- [x] Telegram connection
- [x] Activity Dashboard
- [x] Export functionality

### P1 (Next 4-6 weeks)
- [ ] Schedule Manager
- [ ] Discord connection
- [ ] Visual routing builder
- [ ] Analytics & charts
- [ ] Import configuration
- [ ] Dark mode

### P2 (Future)
- [ ] More channels (Slack, WhatsApp, Email)
- [ ] Multi-user mode
- [ ] Agent marketplace
- [ ] AI-generated SOUL.md
- [ ] Mobile app (PWA)

## 🐛 Known Issues

- State is in-memory only (resets on refresh) - persistence coming soon
- No actual API integration yet - demo mode only
- Schedules page is placeholder
- Discord wizard not implemented yet

## 📄 License

MIT License - See LICENSE file

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Questions?** Check the [full PRD](../PRD-WEBAPP.md) for detailed specifications.

**Ready to build?** `npm run dev` and start creating your crew! 🎭
