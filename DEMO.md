# DataDeck Agent Kit CLI - Demo

## Installation

```bash
cd /home/clawdbot/clawd/datadeck/agent-kit/cli
npm install
```

## Basic Commands

### List available templates
```bash
$ node bin/moltbot-kit.js template --list

Available Persona Templates:

  Family Manager
    Family Manager
    ID: family-manager

  Personal Assistant
    Personal Assistant
    ID: personal-assistant

  Small Business
    Small Business Assistant
    ID: small-business
```

### Apply a template
```bash
$ node bin/moltbot-kit.js template personal-assistant -w /tmp/my-agent
? Apply 'personal-assistant' template to /tmp/my-agent? Yes
✔ Applied Personal Assistant template!

Files created:
  • SOUL.md - Agent personality
  • USER.md - User profile

Next steps:
  1. Edit USER.md with your information
  2. Customize SOUL.md if needed
  3. Run: moltbot-kit validate
```

### Validate configuration
```bash
$ node bin/moltbot-kit.js validate -w /tmp/my-agent

DataDeck Agent Kit Validation
=============================

✔ Workspace files
       ✓ SOUL.md (1439 bytes)
       ✓ USER.md (1065 bytes)
       ✓ AGENTS.md (1282 bytes)
       ✓ MEMORY.md (495 bytes)
       ✓ HEARTBEAT.md (381 bytes)

✔ File content
       ✓ SOUL.md has personality definition
       ✓ USER.md has been customized

✔ Directory structure
       ⚠ memory/ directory not found (will be created on first run)

=============================
Status: READY

Your agent configuration is valid!
```

### Interactive setup wizard
```bash
$ node bin/moltbot-kit.js init -w /tmp/my-agent

🃏 DataDeck Agent Kit Setup

This wizard will guide you through setting up your personal AI assistant.

Step 1: User Profile

? What's your first name? Alice
? What should the agent call you? (leave blank for first name) 
? What's your timezone? America/New_York
? How should the agent communicate? Casual and friendly
? Response length preference? Brief (quick answers)

Step 2: Persona Selection

Choose a persona that best matches your needs:

? Select a persona: Personal Assistant - Personal Assistant

Personal Assistant

? Use this persona? Yes

Step 3: Agent Customization

Give your agent a personality:

? What do you want to name your agent? Alex
? Enable emoji in responses? Yes

Step 4: Review & Generate

Configuration Summary:

  User: Alice
  Timezone: America/New_York
  Persona: Personal Assistant
  Agent Name: Alex
  Communication: casual

? Proceed with generation? Yes
✔ Configuration files generated

Files created:
  • SOUL.md - Agent personality
  • USER.md - User profile
  • AGENTS.md - Behavior rules
  • IDENTITY.md - Agent identity
  • MEMORY.md - Long-term memory
  • HEARTBEAT.md - Periodic tasks
  • TOOLS.md - Environment notes
  • memory/ - Daily logs directory

✓ Setup complete!

Your agent is ready to use.

Next steps:
  1. Review the generated files in /tmp/my-agent
  2. Run: moltbot-kit validate
  3. Start Moltbot in this workspace
  4. Send a test message to your agent
```

## Features Implemented

### ✅ P0 (Must Have) - MVP Complete

1. **`moltbot-kit init`** - Interactive setup wizard
   - User profile collection (name, timezone, preferences)
   - Persona selection from available templates
   - Agent customization (name, emoji settings)
   - Automatic file generation
   - Progress saving (resumable sessions)

2. **`moltbot-kit validate`** - Validation command
   - Checks required files exist
   - Validates file content
   - Detects placeholder text that needs replacement
   - Directory structure verification
   - Clear pass/fail status

3. **`moltbot-kit template <name>`** - Apply persona template
   - List available templates with `--list`
   - Interactive selection if no name provided
   - Applies base templates (AGENTS.md, MEMORY.md, etc.)
   - Copies persona-specific files (SOUL.md, USER.md)
   - Variable substitution for customization

### 📦 Deliverables

- ✅ Working CLI tool in `cli/` directory
- ✅ README with usage instructions
- ✅ All three core commands functional
- ✅ Committed to git

## Technical Implementation

**Architecture:**
- Node.js with commander.js for CLI framework
- Inquirer.js for interactive prompts
- Chalk for colored output
- Ora for loading spinners
- fs-extra for file operations

**Structure:**
```
cli/
├── bin/moltbot-kit.js     # Entry point
├── commands/              # Command implementations
│   ├── init.js
│   ├── validate.js
│   └── template.js
├── lib/                   # Shared utilities
│   ├── state.js          # Progress persistence
│   └── templates.js      # Template engine
├── package.json
└── README.md
```

**Key Features:**
- State persistence (`.moltbot-kit-state.json`)
- Template variable substitution
- Input validation
- Clear error messages
- Progress indicators
- Resumable workflows

## Next Steps (P1/P2)

Future enhancements from the PRD:
- Integration helpers (Google, GitHub, Trello OAuth flows)
- Channel setup wizards (Telegram bot creation, Signal/WhatsApp)
- Cron job configuration UI
- Export/import commands
- Status command
- More persona templates
- Web-based wizard alternative
- Global npm installation

