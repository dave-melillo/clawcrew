# ClawCrew PRD v2.0
## Product Requirements Document: Multi-Agent Moltbot Onboarding Wizard

**Document Status:** Draft for Review  
**Created:** February 5, 2026  
**Owner:** Beast (Dr. Henry McCoy)  
**Target:** Wolverine (Implementation Lead)

---

## Executive Summary

ClawCrew is a guided setup wizard that transforms Moltbot installation from a 30+ minute technical ordeal into a 5-minute delightful experience. Inspired by SimpleClaw's speed promise and Clawi.ai's terminal aesthetic, ClawCrew uses X-Men theming to make multi-agent orchestration approachable and fun.

**Core Promise:** Assemble your mutant crew in 5 minutes or less.

---

## Vision

Create an onboarding wizard that:
1. Makes multi-agent Moltbot setup accessible to non-technical users
2. Guides users through complex configuration without overwhelming them
3. Uses X-Men theming to make agent selection intuitive and memorable
4. Validates configuration at each step to prevent downstream errors
5. Delivers a "wow" moment when agents come online

---

## Research Insights

### What Makes SimpleClaw Effective
- **Speed Promise:** "Under 1 minute" creates urgency and reduces anxiety
- **Comparison Table:** Shows 30 min traditional vs <1 min with their tool
- **Pre-configured Environment:** Servers already set up, just assign them
- **Use Case Grid:** Demonstrates value before asking for commitment
- **Zero Technical Jargon:** "Pick a model, connect Telegram, done"

### What Makes Clawi.ai Effective
- **Terminal Aesthetic:** Feels technical but accessible, builds trust
- **Three-Step Setup:** Numbered, clear, achievable
- **Instant Provisioning:** Removes waiting anxiety
- **Command Center Concept:** Makes monitoring feel powerful
- **Messenger-First:** Connects to tools users already know

### Applied to ClawCrew
- **5-Minute Promise:** Realistic but still fast for multi-agent setup
- **Progress Indicator:** Always show where you are (Step 2 of 6)
- **X-Men Theming:** Makes agent roles memorable and fun
- **Validation Gates:** Can't proceed until current step is valid
- **Test Before Deploy:** Prove it works before celebration

---

## User Journey

### Overview
Six-step wizard with clear progression:
1. **Welcome** - What is ClawCrew?
2. **Detect** - Find or configure Moltbot installation
3. **Assemble** - Choose your agent crew
4. **Configure** - Set up API keys and models
5. **Deploy** - Start your agents
6. **Success** - Celebrate and show next steps

### Detailed Flow

#### Step 1: Welcome Screen
**Goal:** Set expectations and build excitement

**Content:**
- Hero section with X-Men style illustration (team assembling)
- Headline: "Assemble Your Mutant Crew"
- Subheadline: "Set up a multi-agent Moltbot system in 5 minutes"
- Three value props with icons:
  - 🤖 Multiple specialized AI agents
  - 🔄 Orchestrated by a coordinator
  - 💬 Connected to your channels
- "Before/After" comparison (like SimpleClaw):
  - **Manual Setup:** 30+ minutes, 15 config files, terminal commands
  - **ClawCrew:** 5 minutes, 6 guided steps, visual interface
- Big CTA button: "Start Setup →"

**UI Elements:**
- Progress: 0% (or "Welcome" highlighted in stepper)
- No back button (this is step 1)
- Skip link: "I've done this before" → Advanced mode

**X-Men Branding:**
- Use X-Men logo style for ClawCrew logo
- Cerebro aesthetic for progress indicator
- Comic book color palette (blues, golds, dramatic shadows)

---

#### Step 2: Detect Moltbot Installation
**Goal:** Find existing Moltbot or guide installation

**Flow A: Moltbot Detected**
- Green checkmark animation
- "Moltbot detected at: /path/to/moltbot"
- Gateway status: Running ✅ or Stopped ⚠️
- If stopped: "Start Gateway" button with explanation
- Version display: "Moltbot v2.4.0"
- CTA: "Continue →"

**Flow B: Moltbot Not Found**
- Yellow info icon
- "No Moltbot installation detected"
- Two options (tabs or cards):
  1. **I have Moltbot** - Enter custom path
     - Text input with validation
     - "Check This Path" button
     - Helpful hint: "Usually at ~/.moltbot or /opt/moltbot"
  2. **I need to install Moltbot** - Installation guide
     - Link to official docs
     - Quick install command (copy button)
     - "Check Again" button after install
     - Note: "Come back here after installing"

**Validation:**
- Must detect valid Moltbot installation to proceed
- Check gateway health
- Verify config directory is writable

**UI Elements:**
- Progress: Step 1 of 6
- Back button: "← Welcome"
- Next button disabled until validated

**Error Handling:**
- Path not found: "No Moltbot found at this path. Try another?"
- Permission denied: "Can't write to config. Run with proper permissions?"
- Gateway down: "Gateway is stopped. Start it to continue."

**X-Men Branding:**
- Cerebro "scanning" animation while detecting
- Success: "Mutant power detected!" style messaging

---

#### Step 3: Choose Your Crew
**Goal:** Select which agents to deploy

**Layout:**
- Grid of agent cards (2-3 columns on desktop, 1 on mobile)
- Each card shows:
  - Agent codename (e.g., "Gambit")
  - Real name (e.g., "Remy LeBeau")
  - Role (e.g., "Coordinator - Routes tasks to specialists")
  - Power level indicator (Recommended, Advanced, Experimental)
  - Selection checkbox
  - "Learn More" expandable section

**Agents:**

1. **Gambit (Required)**
   - Role: Main Coordinator
   - Description: Routes tasks to specialists, manages workflow
   - Always selected, checkbox disabled
   - Badge: "Required"

2. **Beast**
   - Role: Research & Writing
   - Description: Deep research, technical content, book chapters
   - Badge: "Recommended"

3. **Wolverine**
   - Role: Code & Engineering
   - Description: Builds features, debugs code, infrastructure
   - Badge: "Recommended"

4. **Rogue**
   - Role: Communications
   - Description: Social media, emails, messaging
   - Badge: "Recommended"

5. **Storm**
   - Role: Automation & Monitoring
   - Description: Cron jobs, alerts, system health
   - Badge: "Advanced"

6. **Cyclops**
   - Role: Strategy & Planning
   - Description: Long-term planning, analysis, decisions
   - Badge: "Advanced"

**Presets:**
- "Recommended Setup" (Gambit + Beast + Wolverine + Rogue)
- "Full Team" (All agents)
- "Minimal" (Gambit only)
- "Custom" (user selects)

**Validation:**
- At least Gambit must be selected
- Warning if selecting >5 agents: "Large crews use more resources"

**UI Elements:**
- Progress: Step 2 of 6
- Back button: "← Detect"
- Next button: "Assemble Crew →"
- Counter: "X agents selected"

**X-Men Branding:**
- Each card styled like a mutant dossier
- Hover effect: card "powers up" with glow
- Selection: X-Men logo checkbox

---

#### Step 4: Configure API Keys & Models
**Goal:** Set up credentials for AI models

**Layout:**
- Accordion or tabbed sections for each provider
- Only show providers needed for selected agents
- Each section has:
  - Provider logo
  - "What is this?" explanation
  - API key input (password field with show/hide)
  - "Test Connection" button
  - Green checkmark when validated

**Providers:**
- **Anthropic** (for Claude models)
  - Required for: Gambit, Beast, Wolverine
  - Link: "Get API key →" (opens anthropic.com)
  - Hint: "Starts with sk-ant-..."
- **OpenAI** (if user wants GPT models)
  - Optional unless specifically chosen
  - Link: "Get API key →"
  - Hint: "Starts with sk-..."
- **Groq** (for fast inference)
  - Optional for Storm
  - Link: "Get API key →"

**Model Selection:**
- Dropdown per agent showing compatible models
- Default selections already populated
- Advanced toggle: "Customize per agent"

**Smart Defaults:**
- Gambit: claude-sonnet-4-5 (needs reasoning)
- Beast: claude-sonnet-4-5 (needs quality)
- Wolverine: claude-sonnet-4-5 (needs coding)
- Rogue: claude-haiku-4-5 (speed for comms)

**Validation:**
- Test each API key before proceeding
- Show token balance if API supports it
- Warning if balance is low

**UI Elements:**
- Progress: Step 3 of 6
- Back button: "← Crew"
- Next button: "Configure →" (disabled until all required keys valid)
- Visual feedback: Green checks for validated keys

**Error Handling:**
- Invalid key: "This key doesn't work. Check and try again?"
- Network error: "Can't reach provider. Check internet connection?"
- Rate limit: "This key is rate-limited. Try another?"

**X-Men Branding:**
- Section headers: "Power Sources"
- Validation: "Mutant power validated!" messaging

---

#### Step 5: Deploy & Test
**Goal:** Start agents and verify they work

**Phase A: Deployment**
- Large status display showing each agent starting
- Progress bars for each agent:
  - "Initializing Gambit..." → "Gambit online ✅"
  - "Initializing Beast..." → "Beast online ✅"
  - etc.
- Overall progress: "Deploying 4 of 4 agents..."
- Estimated time: "Usually takes 30-60 seconds"

**Phase B: Health Check**
- Automatic test of each agent:
  - Can it receive tasks?
  - Can it communicate back?
  - Model connection working?
- Green checkmarks for passing tests
- Yellow warnings for non-critical issues
- Red errors for blocking problems

**Phase C: Live Test**
- "Try It Now" section
- Sample prompts:
  - "Hey Gambit, who's on the team?"
  - "Beast, summarize what ClawCrew does"
  - "Wolverine, check system status"
- User picks one, system sends it, shows response
- Proves the system works end-to-end

**Validation:**
- All agents must start successfully
- At least coordinator must pass health check
- Live test must return a response

**UI Elements:**
- Progress: Step 4 of 6
- Back button disabled during deployment
- Next button: "Finish Setup →" (appears after successful test)

**Error Handling:**
- Agent failed to start: "X couldn't start. Check logs?" with log viewer
- Health check failed: "X started but isn't responding. Retry?"
- Timeout: "This is taking longer than expected. Continue anyway?"

**X-Men Branding:**
- Cerebro-style status dashboard
- Success: "All mutants online!" celebration animation
- Deployment progress: "Assembling the team..."

---

#### Step 6: Success & Next Steps
**Goal:** Celebrate completion and guide next actions

**Hero Section:**
- Large success animation (confetti, X-Men style burst)
- Headline: "Your Crew Is Assembled!"
- Subheadline: "Gambit, Beast, Wolverine, and Rogue are online and ready"

**Quick Stats Card:**
- Agents deployed: 4
- Setup time: 3m 42s
- Status: All systems operational ✅

**Next Steps (Numbered Cards):**

1. **Connect Your Channels**
   - "Add Telegram, Discord, Slack, or email"
   - Button: "Add Channel →"
   - Links to channel setup guide

2. **Configure Agent Behaviors**
   - "Customize how each agent works"
   - Button: "Customize →"
   - Links to AGENTS.md editor

3. **Set Up Tools**
   - "Enable cameras, SSH, web browsing, etc."
   - Button: "Configure Tools →"
   - Links to TOOLS.md editor

4. **Create Your First Workflow**
   - "Set up automated tasks and schedules"
   - Button: "Create Workflow →"
   - Links to workflow builder

5. **Read the Docs**
   - "Learn advanced features and troubleshooting"
   - Button: "View Docs →"
   - Links to documentation

**Support Section:**
- "Need help? Join the community"
- Links: Discord, GitHub Issues, Documentation
- Quick tip: "Try asking Gambit for help - he knows the system!"

**Dashboard Access:**
- Big button: "Go to Dashboard →"
- Alternative: "Stay here and configure more"

**UI Elements:**
- Progress: Complete! (100%)
- No back button (setup is done)
- "Setup Another System" link in footer

**X-Men Branding:**
- Victory pose illustration of selected agents
- Certificate-style "Crew Assembled" badge
- Comic book style "SUCCESS!" header

---

## Technical Requirements

### Architecture

**Frontend (Next.js + Tailwind CSS):**
```
/app
  /wizard
    /welcome
    /detect
    /crew
    /configure
    /deploy
    /success
  /components
    /wizard
      - ProgressStepper.tsx
      - AgentCard.tsx
      - ValidationFeedback.tsx
      - DeploymentStatus.tsx
  /lib
    /wizard
      - detectMoltbot.ts
      - validateApiKey.ts
      - deployAgents.ts
      - healthCheck.ts
```

**Backend Integration:**
- Read/write Moltbot config files:
  - `~/.moltbot/config.yaml` - Main configuration
  - `~/.moltbot/agents/*.yaml` - Agent definitions
  - `~/.moltbot/profiles/*.md` - Agent personalities (AGENTS.md)
- Start/stop Moltbot gateway
- Run health checks via Moltbot API
- Send test messages to agents

**State Management:**
- Zustand for wizard state (current step, selections, validation)
- React Query for async operations (detection, deployment)
- Local storage for "resume later" functionality

### Configuration File Structure

**Generated files:**

1. **agents.yaml** (derived from crew selection)
```yaml
agents:
  - id: gambit
    name: Gambit
    role: coordinator
    model: claude-sonnet-4-5
    enabled: true
  - id: beast
    name: Beast
    role: research
    model: claude-sonnet-4-5
    enabled: true
  # ... etc
```

2. **models.yaml** (API keys and model config)
```yaml
providers:
  anthropic:
    api_key: ${ANTHROPIC_API_KEY}
    models:
      - claude-sonnet-4-5
      - claude-haiku-4-5
  openai:
    api_key: ${OPENAI_API_KEY}
    models:
      - gpt-4-turbo
# ... etc
```

3. **AGENTS.md** (personality profiles)
```markdown
# Gambit - Coordinator
You are Gambit (Remy LeBeau)...
[personality and role definition]

# Beast - Research
You are Beast (Dr. Henry McCoy)...
[personality and role definition]
```

### Validation Logic

**Step 2: Detect**
```typescript
async function detectMoltbot(): Promise<DetectionResult> {
  // 1. Check common paths
  const paths = [
    '~/.moltbot',
    '/opt/moltbot',
    process.env.MOLTBOT_HOME
  ];
  
  // 2. Verify gateway binary exists
  // 3. Check config directory is writable
  // 4. Check gateway status
  
  return {
    found: boolean,
    path: string,
    version: string,
    gatewayStatus: 'running' | 'stopped' | 'error',
    writable: boolean
  };
}
```

**Step 4: Configure**
```typescript
async function validateApiKey(
  provider: string,
  key: string
): Promise<ValidationResult> {
  // 1. Format check (regex for key pattern)
  // 2. Live API test (simple completion request)
  // 3. Check token balance if supported
  
  return {
    valid: boolean,
    error?: string,
    balance?: number
  };
}
```

**Step 5: Deploy**
```typescript
async function deployAgents(
  agents: Agent[],
  config: Config
): Promise<DeploymentResult> {
  // 1. Write config files
  // 2. Start/restart gateway
  // 3. Wait for agents to come online
  // 4. Run health checks
  // 5. Send test message
  
  return {
    success: boolean,
    statuses: Map<string, AgentStatus>,
    testResult?: Message
  };
}
```

### Error Recovery

**Network Failures:**
- Show "Retry" button
- Suggest checking internet connection
- Offer offline config export

**Configuration Errors:**
- Highlight specific invalid fields
- Provide correction hints
- Link to documentation

**Deployment Failures:**
- Show detailed error logs
- Offer "View Logs" modal
- Provide rollback option
- Link to troubleshooting guide

**Permission Issues:**
- Detect permission errors
- Show command to fix (e.g., chmod)
- Offer to run with sudo (if safe)

---

## UI/UX Specifications

### Progress Indicator (Cerebro-Style)

**Desktop:**
```
[Welcome] → [Detect] → [Crew] → [Configure] → [Deploy] → [Success]
   ✓          ✓         (3)         4           5           6
```

**Mobile:**
```
Step 3 of 6: Choose Your Crew
[==========>              ] 50%
```

**Behavior:**
- Completed steps: Green with checkmark
- Current step: Blue/gold highlight
- Future steps: Gray
- Click previous steps to go back (with "unsaved changes" warning)

### Agent Cards (Mutant Dossier Style)

**Layout (Desktop):**
```
┌─────────────────────────────────┐
│  [X-MEN LOGO]    GAMBIT     [✓] │
│  Remy LeBeau                    │
│  ─────────────────────────────  │
│  ROLE: Coordinator              │
│  Routes tasks to specialists    │
│  ─────────────────────────────  │
│  [REQUIRED]                     │
│  [Learn More ▼]                 │
└─────────────────────────────────┘
```

**Interaction:**
- Hover: Card glow effect (blue/gold)
- Selected: Border highlight, checkbox checked
- Click anywhere to toggle selection
- "Learn More" expands details inline

### Validation Feedback

**Success:**
```
✓ Moltbot detected at /opt/moltbot
```

**Error:**
```
✗ API key invalid - please check and try again
  [Show details]
```

**Warning:**
```
⚠ This will use significant resources (5+ agents)
  Continue anyway?
```

### Mobile Responsive Design

**Breakpoints:**
- Desktop: 1024px+ (multi-column, sidebar nav)
- Tablet: 768px-1023px (2-column cards)
- Mobile: <768px (single column, sticky progress)

**Mobile Optimizations:**
- Sticky header with step indicator
- Collapsed "Learn More" sections by default
- Large touch targets (48px minimum)
- Bottom-sheet modals for config sections
- Auto-scroll to validation errors

### Accessibility

**WCAG 2.1 AA Compliance:**
- Keyboard navigation (tab order logical)
- Screen reader labels on all interactive elements
- Color contrast minimum 4.5:1
- Focus indicators on all focusable elements
- Skip links for long sections

**ARIA Labels:**
```html
<div role="progressbar" aria-valuenow="3" aria-valuemin="1" aria-valuemax="6">
  Step 3 of 6
</div>

<button aria-label="Select Gambit agent" aria-pressed="true">
  <input type="checkbox" checked />
  Gambit
</button>
```

### Animation & Transitions

**Timing:**
- Step transitions: 300ms ease-in-out
- Card hover: 200ms
- Success animations: 600ms (confetti burst)
- Deployment progress: Real-time (no artificial delay)

**Reduced Motion:**
- Respect `prefers-reduced-motion` media query
- Disable confetti, glow effects
- Use simple fade transitions instead

---

## X-Men Branding Guidelines

### Visual Theme

**Color Palette:**
- Primary: #1E3A8A (Deep blue, X-Men uniform)
- Secondary: #F59E0B (Gold/yellow, X-logo accent)
- Success: #10B981 (Mutant power green)
- Error: #EF4444 (Danger red)
- Background: #0F172A (Dark slate, Cerebro room)
- Card background: #1E293B (Lighter slate)

**Typography:**
- Headers: "Bangers" or "Permanent Marker" (comic book style)
- Body: "Inter" or "Roboto" (clean, readable)
- Code: "Fira Code" (for config snippets)

### Iconography

**Agent Icons:**
- Gambit: Playing card (spade)
- Beast: Book with glasses
- Wolverine: Claw marks
- Rogue: Power absorption symbol
- Storm: Weather icon
- Cyclops: Visor/optic blast

**UI Icons:**
- Success: X-Men logo with checkmark
- Error: Alert symbol (consistent with theme)
- Progress: Cerebro scanning animation
- Loading: Spinning X-Men logo

### Microcopy (Voice & Tone)

**Energetic, but not cheesy:**
- ✓ "Your crew is assembled!"
- ✗ "BAMF! Powers activated!"

**Clear, helpful errors:**
- ✓ "Can't connect to Anthropic. Check your API key?"
- ✗ "CRITICAL MUTATION FAILURE!"

**Encouraging, not pushy:**
- ✓ "Almost there - just configure your API keys"
- ✗ "HURRY! Complete setup NOW!"

**Comic book Easter eggs (subtle):**
- Progress: "Initializing Cerebro..." (Step 2)
- Success: "Welcome to Xavier's School" (Step 6)
- Deployment: "Assembling the team..."
- But keep it subtle - UX first, theming second

---

## Performance Requirements

### Load Time Targets
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Wizard step transition: <300ms
- API validation: <5s with loading state

### Resource Usage
- Bundle size: <200KB (initial)
- Route-based code splitting for each step
- Lazy load agent portraits/illustrations
- Optimize SVG assets (compress, inline critical)

### Reliability
- Graceful degradation if JavaScript fails
- Retry logic for API calls (3 attempts with backoff)
- Auto-save wizard state to localStorage
- "Resume setup" if user refreshes mid-wizard

---

## Success Metrics

### Onboarding Funnel
Track completion rate at each step:
```
1. Welcome viewed:       100% (baseline)
2. Moltbot detected:     __% (critical drop-off point)
3. Crew selected:        __%
4. API keys configured:  __% (another critical point)
5. Deployment started:   __%
6. Success reached:      __% (ultimate goal: >80%)
```

### Time to Complete
- Target: <5 minutes (median)
- Stretch goal: <3 minutes
- Track per-step duration to identify bottlenecks

### Error Rate
- API key validation failures
- Deployment failures
- User retries per step
- Goal: <10% error rate per step

### User Satisfaction
- Post-setup survey (optional, 1 question)
- "How easy was setup?" (1-5 scale)
- Goal: Average >4.0

---

## Out of Scope (For v1)

**Not included in initial release:**
- Custom agent creation (use predefined agents only)
- Advanced model tuning (temperature, top-p, etc.)
- Channel configuration (save for separate flow)
- Workflow builder (separate feature)
- Multi-environment setups (dev/staging/prod)
- Team collaboration features
- Cost estimation calculator
- Agent marketplace or sharing

**Future consideration:**
- Automated Moltbot installation (if not detected)
- Docker container deployment option
- Cloud hosting integration (one-click deploy to VPS)
- Agent personality customization wizard
- Visual workflow builder
- Pre-built agent templates for common use cases

---

## Implementation Roadmap

### Phase 1: Core Wizard (Week 1-2)
- [ ] Scaffold Next.js app structure
- [ ] Build ProgressStepper component
- [ ] Implement Steps 1-3 (Welcome, Detect, Crew)
- [ ] Agent card components with selection
- [ ] Basic validation logic

### Phase 2: Configuration & Deploy (Week 3)
- [ ] API key input and validation
- [ ] Model selection interface
- [ ] Config file generation logic
- [ ] Deployment status UI
- [ ] Health check implementation

### Phase 3: Polish & Testing (Week 4)
- [ ] Success screen with next steps
- [ ] Error handling and recovery flows
- [ ] Mobile responsive design
- [ ] Accessibility audit and fixes
- [ ] Performance optimization

### Phase 4: Integration (Week 5)
- [ ] Connect to actual Moltbot API
- [ ] End-to-end testing with real deployments
- [ ] Load testing (handle concurrent setups)
- [ ] Documentation and tooltips
- [ ] Beta testing with 5-10 users

### Phase 5: Launch (Week 6)
- [ ] Final bug fixes
- [ ] Analytics integration
- [ ] User feedback mechanism
- [ ] Launch announcement
- [ ] Monitor metrics

---

## Dependencies

**Required:**
- Next.js 14+ (App Router)
- Tailwind CSS 3+
- TypeScript 5+
- Zustand (state management)
- React Query (async state)

**Moltbot Side:**
- Gateway API endpoints for:
  - Status checks
  - Agent deployment
  - Health monitoring
  - Config validation
- Config file schema documentation

**External:**
- Anthropic API (for key validation)
- OpenAI API (optional, for validation)
- Groq API (optional, for validation)

---

## Testing Strategy

### Unit Tests
- Validation logic (detectMoltbot, validateApiKey)
- Config file generation
- State management (Zustand stores)
- Component utilities

### Integration Tests
- Full wizard flow (Playwright)
- API key validation with mock servers
- Deployment with test Moltbot instance
- Error recovery scenarios

### E2E Tests
- Fresh install to deployed agents
- Resume interrupted setup
- Mobile device testing (real devices)
- Accessibility testing (screen readers)

### Manual Testing Checklist
- [ ] Complete wizard with each preset crew
- [ ] Test all error states (invalid keys, failed deployment)
- [ ] Verify config files are correct
- [ ] Confirm agents actually work after setup
- [ ] Test on 3 browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile (iOS and Android)
- [ ] Test with screen reader (VoiceOver/NVDA)

---

## Open Questions (For Dave)

1. **Moltbot Installation:**
   - Should we auto-install Moltbot if not detected, or just link to docs?
   - What's the minimum Moltbot version required?

2. **Agent Personalities:**
   - Can we ship default AGENTS.md files for each character?
   - How much personality customization do we expose in v1?

3. **Multi-User:**
   - Is this single-user (local setup) or multi-user (hosted service)?
   - Do we need authentication in v1?

4. **Channel Integration:**
   - Should Step 6 include a "Quick Add Telegram" flow?
   - Or keep channel config separate from initial setup?

5. **Error Recovery:**
   - How much troubleshooting do we build in vs. linking to docs?
   - Should we include a "Get Help" chat widget?

6. **Branding:**
   - Any legal concerns with X-Men branding (Marvel IP)?
   - Do we need a disclaimer or "inspired by" note?

---

## Appendix A: Wireframes

### Step 3: Choose Your Crew (Desktop)
```
┌────────────────────────────────────────────────────────────┐
│  ClawCrew                                    Step 2 of 6    │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  Choose Your Crew                                           │
│  Select the agents you want to deploy. Gambit is required  │
│  as your coordinator.                                       │
│                                                              │
│  Presets: [Recommended] [Full Team] [Minimal] [Custom]     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   GAMBIT  [✓]│  │   BEAST   [ ]│  │ WOLVERINE [ ]│     │
│  │ Remy LeBeau  │  │ Dr. H McCoy  │  │   Logan      │     │
│  │──────────────│  │──────────────│  │──────────────│     │
│  │ Coordinator  │  │   Research   │  │ Engineering  │     │
│  │ Routes tasks │  │ Deep content │  │ Code & infra │     │
│  │──────────────│  │──────────────│  │──────────────│     │
│  │  [REQUIRED]  │  │ [RECOMMENDED]│  │ [RECOMMENDED]│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   ROGUE   [ ]│  │   STORM   [ ]│  │  CYCLOPS  [ ]│     │
│  │   Marie      │  │ Ororo Munroe │  │Scott Summers │     │
│  │──────────────│  │──────────────│  │──────────────│     │
│  │Communications│  │  Automation  │  │   Strategy   │     │
│  │Social & email│  │ Cron & alerts│  │ Long-term    │     │
│  │──────────────│  │──────────────│  │──────────────│     │
│  │ [RECOMMENDED]│  │  [ADVANCED]  │  │  [ADVANCED]  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│                      1 agent selected                       │
│                                                              │
│  [← Back]                          [Assemble Crew →]       │
└────────────────────────────────────────────────────────────┘
```

### Step 5: Deploy & Test (During Deployment)
```
┌────────────────────────────────────────────────────────────┐
│  ClawCrew                                    Step 4 of 6    │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  Assembling Your Crew                                       │
│  Starting agents and running health checks...               │
│                                                              │
│  ┌────────────────────────────────────────────────────┐   │
│  │  ● Gambit      [████████████████] Online ✓         │   │
│  │  ● Beast       [████████████████] Online ✓         │   │
│  │  ● Wolverine   [████████░░░░░░░░] Starting...      │   │
│  │  ● Rogue       [░░░░░░░░░░░░░░░░] Waiting...       │   │
│  └────────────────────────────────────────────────────┘   │
│                                                              │
│  Overall Progress: Deploying 3 of 4 agents...              │
│  [████████████████████░░░░░░░░] 75%                        │
│                                                              │
│  Usually takes 30-60 seconds                                │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

---

## Appendix B: Sample Config Output

**Generated: ~/.moltbot/clawcrew/agents.yaml**
```yaml
version: 2.0
coordinator: gambit

agents:
  gambit:
    name: Gambit
    codename: gambit
    role: coordinator
    model: claude-sonnet-4-5
    enabled: true
    profile: /home/user/.moltbot/clawcrew/profiles/gambit.md
    
  beast:
    name: Beast
    codename: beast
    role: research
    model: claude-sonnet-4-5
    enabled: true
    profile: /home/user/.moltbot/clawcrew/profiles/beast.md
    
  wolverine:
    name: Wolverine
    codename: wolverine
    role: engineering
    model: claude-sonnet-4-5
    enabled: true
    profile: /home/user/.moltbot/clawcrew/profiles/wolverine.md
    
  rogue:
    name: Rogue
    codename: rogue
    role: communications
    model: claude-haiku-4-5
    enabled: true
    profile: /home/user/.moltbot/clawcrew/profiles/rogue.md
```

**Generated: ~/.moltbot/clawcrew/models.yaml**
```yaml
providers:
  anthropic:
    api_key_env: ANTHROPIC_API_KEY
    models:
      claude-sonnet-4-5:
        max_tokens: 8192
        temperature: 1.0
      claude-haiku-4-5:
        max_tokens: 4096
        temperature: 1.0
        
default_model: claude-sonnet-4-5

routing:
  coordinator: claude-sonnet-4-5
  research: claude-sonnet-4-5
  engineering: claude-sonnet-4-5
  communications: claude-haiku-4-5
```

---

## Conclusion

ClawCrew transforms Moltbot setup from a technical chore into an engaging experience. By combining SimpleClaw's speed promise, Clawi.ai's clear progression, and X-Men theming for memorable agent roles, we make multi-agent orchestration accessible to everyone.

**Key Success Factors:**
1. **Speed:** 5-minute promise (realistic, tested)
2. **Clarity:** 6 clear steps, always know where you are
3. **Validation:** Can't proceed with invalid config
4. **Fun:** X-Men theming makes agents memorable
5. **Proof:** Live test before declaring success

**Handoff to Wolverine:**
This PRD gives you everything needed to build ClawCrew. All UX decisions are documented, edge cases considered, and technical requirements specified. Wire me (Beast) if you need clarification on any research findings. Wire Gambit if you need product direction.

Let's assemble this crew.

— Beast (Dr. Henry McCory)
