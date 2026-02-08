# ClawCrew Implementation Roadmap

**Created:** February 8, 2026
**Status:** Active Development
**Priority:** SHIP IT

---

## Current State Assessment

### What Exists

**CLI Tool (v1.0 - MVP Complete)**
- Interactive `init` wizard (4-step: profile, persona, agent, generate)
- 3 persona templates (Personal Assistant, Family Manager, Small Business)
- Template engine with variable substitution
- Validation command for workspace checks
- State persistence for resume-able sessions
- Branding: needs moltbot-kit -> clawcrew cleanup

**Web App (Demo Quality)**
- Next.js 15 + React 19 + Tailwind + shadcn/ui + Zustand
- 8 agent templates (Coordinator, Engineer, Researcher, Creative, Scheduler, Writer, Analyst, Support)
- Agent card grid with add/edit/delete/toggle
- Agent editor with SOUL.md editing, model selection, temperature control
- Activity page (mock data)
- Channels page with Telegram wizard (simulated connection)
- Schedules page (stub)
- Export to JSON (client-side only)
- NO persistence - all state lost on refresh
- NO backend integration

### What's Missing for Release

1. **The Core Differentiator**: Crew orchestration engine (agent-to-agent communication)
2. **Persistence**: LocalStorage at minimum, backend API for real use
3. **Setup Wizard**: The 6-step onboarding flow from PRD v3
4. **Moltbot Integration**: Actually connecting to and deploying openclaw instances
5. **Branding Cleanup**: moltbot-kit references throughout CLI

---

## Competitive Positioning

**Bits (YC W26)** = Easy OpenClaw hosting (one instance)
**ClawCrew** = Multi-agent CREW orchestration layer

> "Bits gets you one OpenClaw. ClawCrew gets you a team."

Our differentiators to build and ship:
1. Multi-agent crews with role specialization
2. Agent-to-agent task delegation
3. Crew templates (pre-built team compositions)
4. Visual orchestration dashboard (Danger Room)
5. Autonomous workflows with handoffs

---

## Release Strategy: Phased MVP

### Phase 0: Foundation Cleanup (NOW)
- [ ] Fix all branding (moltbot-kit -> clawcrew) in CLI
- [ ] Add localStorage persistence to webapp
- [ ] Unify templates between CLI and webapp
- [ ] Fix package.json bin configuration

### Phase 1: Crew Engine (THE DIFFERENTIATOR)
- [ ] Build `CrewEngine` - the orchestration core
  - Agent registry (add/remove/configure agents)
  - Message routing between agents
  - Task delegation protocol
  - Agent state machine (idle, working, delegating, blocked)
- [ ] Build `CrewTemplate` system
  - Pre-built team compositions (Startup Crew, Content Crew, Dev Crew)
  - One-click crew deployment
  - Custom crew builder
- [ ] Agent-to-agent communication protocol
  - Structured message format
  - Task handoff with context
  - Result aggregation

### Phase 2: Setup Wizard (6-Step Onboarding)
- [ ] Welcome screen with value props
- [ ] Moltbot detection / installation guide
- [ ] Team assembly (crew template selection)
- [ ] API key configuration + validation
- [ ] Deploy & health check
- [ ] Success + next steps

### Phase 3: Danger Room (Visual Command Center)
- [ ] Real-time crew status dashboard
- [ ] Message flow visualization
- [ ] Agent performance metrics
- [ ] Task queue visualization
- [ ] Live activity feed (replacing mock data)

### Phase 4: Integration & Polish
- [ ] Real Telegram bot integration
- [ ] Moltbot gateway API integration
- [ ] Config file export to valid moltbot format
- [ ] Schedule manager implementation
- [ ] Error handling and recovery flows

---

## Technical Architecture

### Crew Engine (New - Core Differentiator)

```
src/lib/crew/
  engine.ts        - CrewEngine: orchestration core
  agent.ts         - Agent class with state machine
  router.ts        - Message routing between agents
  protocol.ts      - Agent-to-agent communication protocol
  templates.ts     - Pre-built crew compositions
```

### Key Interfaces

```typescript
interface CrewAgent {
  id: string;
  name: string;
  role: AgentRole;
  model: string;
  soul: string;           // SOUL.md content
  status: 'idle' | 'working' | 'delegating' | 'blocked';
  capabilities: string[];
  routing_keywords: string[];
}

interface Crew {
  id: string;
  name: string;
  agents: CrewAgent[];
  coordinator: string;    // ID of coordinator agent
  config: CrewConfig;
}

interface CrewMessage {
  from: string;           // agent ID
  to: string;             // agent ID or 'coordinator'
  type: 'task' | 'result' | 'delegate' | 'status';
  content: string;
  context?: Record<string, any>;
  timestamp: number;
}

interface CrewTemplate {
  id: string;
  name: string;
  description: string;
  agents: Partial<CrewAgent>[];
  recommended_for: string[];
}
```

### Crew Templates to Ship

1. **Startup Crew** - Coordinator + Engineer + Researcher + Creative
2. **Content Crew** - Coordinator + Writer + Researcher + Creative
3. **Dev Team** - Coordinator + Engineer + Analyst + Support
4. **Solo+ Setup** - Coordinator + one specialist (user picks)
5. **Full Stack** - All 8 agents

---

## Priority Order

1. **Phase 0** - Can ship in hours, unblocks everything
2. **Phase 1** - THE thing that makes us different from Bits
3. **Phase 2** - The onboarding that makes us accessible
4. **Phase 3** - The visual wow factor
5. **Phase 4** - Production readiness

---

## What We're NOT Building (Yet)

- Payment/billing (handle separately)
- User authentication (local-first for now)
- Cloud hosting (users bring their own or use Bits!)
- Mobile app
- Community marketplace
- Voice/TTS configuration

---

*Last updated: February 8, 2026*
