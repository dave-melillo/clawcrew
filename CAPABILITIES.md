# ClawCrew Capabilities

What Gambit can do out of the box.

## 🔧 Build

- **Web apps** - Next.js, React, HTML/CSS
- **APIs** - Node.js, Python
- **Scripts** - Bash, Python, TypeScript
- **Automations** - Cron jobs, webhooks

## 🔍 Research

- **X/Twitter** - Search tweets, profiles, threads (requires X_BEARER_TOKEN)
- **Web** - Search and fetch any URL
- **Memory** - Search past conversations and decisions

## 🚀 Ship

- **Vercel** - Deploy web apps (requires VERCEL_TOKEN)
- **GitHub** - Create repos, push code, manage PRs

## 📊 Monitor

- **Mission Control** - Dashboard showing active work, backlog, blocked items
- **Trello Sync** - Two-way sync with Trello boards (requires TRELLO keys)

## 📝 Write

- **Copy** - Marketing pages, emails, documentation
- **Code** - Any language, with tests
- **Docs** - Technical specs, guides, READMEs

## 🗣️ Communicate

- **Telegram** - Receive and send messages
- **Email** - Read and draft (via gog skill)
- **Calendar** - Check and create events

## ⚙️ Configure

Required keys in `config.env`:
- `ANTHROPIC_API_KEY` - Required for Claude

Optional keys:
- `X_BEARER_TOKEN` - X/Twitter research
- `VERCEL_TOKEN` - Deploy to Vercel
- `TRELLO_API_KEY` + `TRELLO_TOKEN` - Trello sync
- `ELEVENLABS_API_KEY` - Voice synthesis
- `DEEPGRAM_API_KEY` - Speech recognition

## 🎯 Workflow

1. **Ask** - Tell Gambit what you want
2. **Build** - Gambit builds it
3. **Ship** - Gambit deploys it
4. **Done** - You get a link

No PRDs. No approval chains. No ceremony.
