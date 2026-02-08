/**
 * ClawCrew Task Executor
 *
 * Simulates realistic agent behavior for demo purposes.
 * Each agent role produces role-specific, context-aware responses.
 * Supports delegation chains, parallel execution, and multi-agent collaboration.
 *
 * When real LLM integration lands, this becomes the adapter layer.
 */

import type { Agent, AgentRole } from '@/types';

export interface ExecutionStep {
  agentId: string;
  agentName: string;
  agentEmoji: string;
  type: 'thinking' | 'working' | 'delegating' | 'reviewing' | 'complete';
  content: string;
  duration: number; // ms
  timestamp: number;
}

export interface ExecutionPlan {
  id: string;
  userMessage: string;
  steps: ExecutionStep[];
  primaryAgent: string;
  delegations: { from: string; to: string; reason: string }[];
  collaborators: string[];
  finalResponse: string;
  totalDuration: number;
}

/** Extract key topics from user input for context-aware responses */
function extractTopics(input: string): {
  subject: string;
  action: string;
  details: string[];
  isQuestion: boolean;
} {
  const words = input.split(/\s+/);
  const isQuestion = /\?$|^(how|what|why|when|where|who|can|should|could|would|is|are|do|does)/i.test(input);

  // Extract quoted strings as key details
  const quoted = input.match(/"[^"]+"|'[^']+'/g)?.map(s => s.slice(1, -1)) || [];

  // Find the main subject (first notable noun phrase after action verb)
  const actionWords = ['build', 'create', 'write', 'design', 'fix', 'analyze', 'research', 'schedule',
    'draft', 'help', 'review', 'deploy', 'test', 'implement', 'plan', 'improve', 'optimize',
    'debug', 'set up', 'configure', 'add', 'remove', 'update', 'check', 'find', 'explain'];

  let action = 'handle';
  let subjectStart = 0;
  for (const word of actionWords) {
    const idx = input.toLowerCase().indexOf(word);
    if (idx !== -1) {
      action = word;
      subjectStart = idx + word.length;
      break;
    }
  }

  // Get everything after the action verb as the subject
  const subjectPart = input.slice(subjectStart).trim();
  const subject = subjectPart.replace(/^(a|an|the|me|my|our|some)\s+/i, '').split(/[.!?\n]/)[0].trim();

  return {
    subject: subject || input.slice(0, 60),
    action,
    details: quoted.length > 0 ? quoted : words.filter(w => w.length > 4).slice(0, 5),
    isQuestion,
  };
}

/** Pick a random item from an array */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Role-specific response generators with context awareness */
const roleResponders: Record<AgentRole, (input: string, context?: string) => {
  thinking: string;
  response: string;
  shouldDelegate?: { toRole: AgentRole; reason: string };
  shouldCollaborate?: { withRoles: AgentRole[]; reason: string };
}> = {
  coordinator: (input: string) => {
    const { subject, action } = extractTopics(input);
    return {
      thinking: pick([
        `Analyzing request scope and routing: "${subject.slice(0, 50)}"...`,
        `Determining which specialist handles "${action}" best...`,
        `Breaking down this request into actionable parts...`,
      ]),
      response: `I've reviewed this request about ${subject.slice(0, 60)} and routed it to the appropriate specialist. I'll coordinate any cross-team work needed.`,
    };
  },

  engineer: (input: string) => {
    const { subject, action, isQuestion, details } = extractTopics(input);
    const hasResearch = /research|why|compare|analyze|investigate|evaluate/i.test(input);
    const needsDesign = /design|ui|ux|visual|mockup|wireframe|layout/i.test(input);

    if (hasResearch) {
      return {
        thinking: `Need research context before I can implement ${subject.slice(0, 40)}...`,
        response: `I can build this, but I need a clearer technical specification first. Let me pull in Researcher for a technical deep-dive.`,
        shouldDelegate: { toRole: 'researcher', reason: `Need technical research on ${subject.slice(0, 50)} before implementation` },
      };
    }

    if (needsDesign) {
      return {
        thinking: `This involves visual/design work alongside code...`,
        response: `I'll handle the technical implementation. Let me collaborate with Creative for the design side.`,
        shouldCollaborate: { withRoles: ['creative'], reason: 'Design + engineering collaboration needed' },
      };
    }

    const thinkingOptions = [
      `Breaking down the technical requirements for ${subject.slice(0, 40)}...`,
      `Assessing implementation approach: ${action} ${subject.slice(0, 40)}...`,
      `Scoping the engineering work for this...`,
    ];

    const codeResponse = `**Implementation Plan: ${subject.slice(0, 50)}**

1. **Architecture**: Set up the project structure and define the data model
2. **Core Logic**: Implement ${subject.slice(0, 40)} with proper error handling
3. **API Layer**: Build the endpoints/interfaces needed
4. **Testing**: Unit tests for edge cases + integration tests
5. **Review**: Code review checklist and performance check

**Tech considerations:**
- ${pick(['TypeScript for type safety', 'React hooks for state management', 'Edge functions for low latency'])}
- ${pick(['Proper input validation at boundaries', 'Graceful error handling with fallbacks', 'Optimistic UI updates for responsiveness'])}
- Estimated complexity: ${input.length > 100 ? 'Medium-High' : 'Low-Medium'}

Ready to start. Want me to proceed with step 1?`;

    const generalResponse = `I'll ${action} this for you. Here's my approach:

- **Step 1**: Assess the current state and identify requirements
- **Step 2**: ${pick(['Implement the minimal viable solution', 'Build the core functionality first', 'Set up the foundation and iterate'])}
- **Step 3**: ${pick(['Write tests and verify edge cases', 'Run the full test suite', 'Validate with integration checks'])}

${isQuestion ? `To answer your question: the best approach here depends on your constraints. I'd recommend starting simple and iterating.` : `I'll keep it clean and well-tested.`}`;

    return {
      thinking: pick(thinkingOptions),
      response: /code|build|fix|implement|debug|script|function|api|bug|deploy|test|create|set up/i.test(input) ? codeResponse : generalResponse,
    };
  },

  researcher: (input: string) => {
    const { subject, isQuestion, details } = extractTopics(input);
    const hasData = /data|metrics|numbers|stats|trends|revenue|conversion/i.test(input);

    if (hasData) {
      return {
        thinking: 'This requires quantitative analysis beyond research...',
        response: `I can provide the qualitative research context, but the data-driven analysis of ${subject.slice(0, 40)} should go to our Analyst for proper metrics work.`,
        shouldDelegate: { toRole: 'analyst', reason: `Quantitative analysis of ${subject.slice(0, 50)} needed` },
      };
    }

    return {
      thinking: pick([
        `Deep-diving into ${subject.slice(0, 40)}...`,
        `Cross-referencing knowledge sources on ${subject.slice(0, 40)}...`,
        `Analyzing ${subject.slice(0, 40)} from multiple perspectives...`,
      ]),
      response: `**Research: ${subject.slice(0, 50)}**

**Key Findings:**
- ${pick(['Current best practices favor an iterative approach', 'The market is moving toward simpler, more composable solutions', 'Recent developments have shifted the landscape significantly'])}
- ${pick(['Three viable approaches exist, each with distinct trade-offs', 'The most successful implementations share a common pattern', 'Both established and emerging solutions have clear pros/cons'])}
- ${pick(['Community sentiment strongly favors simplicity', 'Performance benchmarks show clear winners in specific scenarios', 'User research points to a gap in existing solutions'])}

**Recommendation:**
${isQuestion
  ? `Based on my analysis, the answer depends on your specific constraints. The most pragmatic approach is to start focused and expand.`
  : `Start with a focused scope targeting the highest-impact area. This minimizes risk while delivering value quickly.`
}

**Trade-offs to consider:**
- Speed vs thoroughness (${pick(['lean toward speed for v1', 'thoroughness pays off long-term', 'depends on your timeline'])})
- Simplicity vs flexibility (${pick(['start simple, add flexibility as needed', 'build flexible from day one if possible', 'simple wins in most cases'])})
- Build vs buy (${pick(['building gives you control', 'buying saves time', 'hybrid approach often works best'])})

Want me to go deeper on any specific angle?`,
    };
  },

  creative: (input: string) => {
    const { subject, action } = extractTopics(input);
    const needsCode = /code|implement|build|deploy|api|function/i.test(input);

    if (needsCode) {
      return {
        thinking: 'This needs engineering implementation alongside the creative work...',
        response: `I'll handle the creative direction. Let me collaborate with Engineer for the implementation.`,
        shouldCollaborate: { withRoles: ['engineer'], reason: 'Creative + engineering collaboration' },
      };
    }

    return {
      thinking: pick([
        `Exploring creative directions for ${subject.slice(0, 40)}...`,
        `Generating visual concepts and ideas...`,
        `Brainstorming approaches to ${action} ${subject.slice(0, 40)}...`,
      ]),
      response: `**Creative Direction: ${subject.slice(0, 50)}**

**Concept:** ${pick([
  'Bold and modern with dynamic visual hierarchy',
  'Clean and minimal with purposeful use of space',
  'Warm and inviting with a focus on human connection',
  'Professional yet approachable with subtle personality',
])}

**Visual Language:**
- **Color palette:** ${pick(['Deep navy + warm amber accents for trust', 'Fresh gradients transitioning from teal to purple', 'Monochrome with a single bold accent color'])}
- **Typography:** ${pick(['Inter for headings, system fonts for body', 'Bold sans-serif for impact, serif for body warmth', 'Clean geometric sans-serif throughout'])}
- **Visual style:** ${pick(['Illustrations over photos for uniqueness', 'Photography with overlay treatments', 'Abstract geometric patterns for tech feel'])}

**Mood:** ${pick([
  'Confident but not corporate. Human but polished.',
  'Energetic and forward-looking. Innovation meets clarity.',
  'Calm and trustworthy. Competence without complexity.',
])}

I can develop this into ${pick(['detailed mockups', 'a mood board', 'wireframes and specs', 'a design system'])} - which would be most useful?`,
    };
  },

  scheduler: (input: string) => {
    const { subject } = extractTopics(input);
    const hasTiming = /remind|schedule|every|daily|weekly|calendar|when|morning|evening|recurring|cron|automate/i.test(input);

    return {
      thinking: pick([
        `Working out the timing for ${subject.slice(0, 40)}...`,
        `Evaluating scheduling options and constraints...`,
        `Setting up automation for this request...`,
      ]),
      response: hasTiming
        ? `**Schedule: ${subject.slice(0, 50)}**

- **Type**: ${pick(['Recurring daily', 'Weekly summary', 'One-time reminder', 'Automated briefing'])}
- **Timezone**: Auto-detected from your profile
- **Delivery**: Active channels (${pick(['Telegram', 'all connected channels', 'primary channel'])})
- **Status**: Ready to activate

**What you'll get:**
${pick([
  '- A concise summary at your preferred time\n- Smart grouping of related items\n- Actionable next steps highlighted',
  '- Timely reminders before deadlines\n- Context included so you can act immediately\n- Adjustable frequency and timing',
  '- Daily digest of relevant updates\n- Prioritized by importance\n- One-tap actions for common responses',
])}

The schedule is configured. Want me to adjust the timing or add any conditions?`
        : `I can help automate the timing around ${subject.slice(0, 40)}. Options:

1. **One-time reminder** - I'll ping you at a specific time
2. **Recurring schedule** - Daily, weekly, or custom interval
3. **Event-triggered** - Fire when something specific happens
4. **Smart briefing** - Automated summary at your preferred time

Which works best for your use case?`,
    };
  },

  writer: (input: string) => {
    const { subject, action, isQuestion } = extractTopics(input);
    const hasContent = /write|draft|compose|email|blog|document|letter|copy|post|article|content/i.test(input);
    const needsResearch = /research|fact|source|data|statistics/i.test(input);

    if (needsResearch) {
      return {
        thinking: 'This content piece needs research backing...',
        response: `I'll draft the content, but let me pull in Researcher first to get the facts right.`,
        shouldDelegate: { toRole: 'researcher', reason: `Need research for ${subject.slice(0, 50)} content piece` },
      };
    }

    return {
      thinking: pick([
        `Crafting the right tone and structure for ${subject.slice(0, 40)}...`,
        `Finding the voice for this piece about ${subject.slice(0, 40)}...`,
        `Structuring the content flow...`,
      ]),
      response: hasContent
        ? `**Draft: ${subject.slice(0, 50)}**

---

${pick([
  `The way we think about ${subject.slice(0, 30)} is changing. Here's what that means for you.\n\nFor too long, the default approach has been [the old way]. But a new pattern is emerging - one that prioritizes [the new way] without sacrificing [the key concern].`,
  `Let's talk about ${subject.slice(0, 30)}.\n\nIf you've been following this space, you know things are moving fast. The key insight most people miss is that simplicity and power aren't opposites - they're multipliers.`,
  `Here's the thing about ${subject.slice(0, 30)}: most advice gets it wrong.\n\nThe conventional wisdom says you need [complex approach]. The reality? The teams shipping the fastest are doing something much simpler.`,
])}

---

**Content notes:**
- **Tone**: ${pick(['Conversational but authoritative', 'Direct and value-focused', 'Engaging with a clear point of view'])}
- **Length**: ~${pick(['500', '800', '1200'])} words
- **Hook**: ${pick(['Opens with a shift statement', 'Leads with a contrarian take', 'Starts with a relatable scenario'])}
- **CTA**: ${pick(['Encourages next action', 'Links to deeper resource', 'Prompts reflection and engagement'])}

Want me to expand this, adjust the tone, or take it in a different direction?`
        : `I can help with the writing side of ${subject.slice(0, 40)}. ${isQuestion ? "Here's my take:" : "Here's how I'd approach it:"}

- **Format**: ${pick(['Blog post with clear sections', 'Professional email with action items', 'Documentation with examples', 'Social content with hooks'])}
- **Tone**: Matched to your audience
- **Structure**: ${pick(['Problem → solution → action', 'Hook → value → proof → close', 'Context → insight → recommendation'])}

What format and audience am I writing for?`,
    };
  },

  analyst: (input: string) => {
    const { subject } = extractTopics(input);

    return {
      thinking: pick([
        `Crunching the numbers on ${subject.slice(0, 40)}...`,
        `Building analysis framework for ${subject.slice(0, 40)}...`,
        `Processing available data points...`,
      ]),
      response: `**Analysis: ${subject.slice(0, 50)}**

**Executive Summary:**
Based on the available data, there are ${pick(['3 key insights', '4 notable trends', 'several actionable findings'])} worth highlighting.

**Key Metrics:**
| Metric | Current | Trend | Status |
|--------|---------|-------|--------|
| ${pick(['Engagement', 'Performance', 'Throughput'])} | ${pick(['Good', 'Above average', 'Steady'])} | ${pick(['Trending up', 'Stable', 'Slight uptick'])} | ${pick(['On track', 'Watch', 'Healthy'])} |
| ${pick(['Efficiency', 'Conversion', 'Retention'])} | ${pick(['Room to improve', 'Strong', 'Meeting target'])} | ${pick(['Improving', 'Flat', 'Positive'])} | ${pick(['Action needed', 'Maintain', 'Good'])} |
| ${pick(['Satisfaction', 'Quality', 'Coverage'])} | ${pick(['High', 'Moderate', 'Above target'])} | ${pick(['Consistent', 'Growing', 'Stable'])} | ${pick(['Excellent', 'On track', 'Strong'])} |

**Insights:**
1. ${pick(['The primary driver is outperforming expectations', 'There is a clear opportunity in the underserved segment', 'Efficiency gains are compounding over time'])}
2. ${pick(['The bottleneck is in the middle of the funnel', 'Seasonal patterns suggest timing optimization', 'Segmentation reveals hidden opportunities'])}
3. ${pick(['Current trajectory puts you ahead of target', 'Risk factors are manageable with the right actions', 'Competitive position is strengthening'])}

**Recommendation:**
Focus on the top ${pick(['2', '3'])} levers for maximum impact. I can drill into any specific metric or build a ${pick(['dashboard', 'detailed report', 'forecast model'])} if needed.`,
    };
  },

  support: (input: string) => {
    const { subject, isQuestion } = extractTopics(input);
    const hasIssue = /help|problem|issue|broken|error|how do i|can't|doesn't work|trouble|stuck|wrong/i.test(input);

    return {
      thinking: pick([
        `Understanding the issue with ${subject.slice(0, 40)}...`,
        `Looking up solutions for this type of request...`,
        `Checking common resolutions for ${subject.slice(0, 40)}...`,
      ]),
      response: hasIssue
        ? `**Troubleshooting: ${subject.slice(0, 50)}**

Here's what I'd suggest:

1. **Quick Check** - ${pick([
  'Verify your configuration is up to date',
  'Make sure all connections are active',
  'Check that permissions are set correctly',
])}

2. **Common Fix** - ${pick([
  'Try refreshing the connection (disconnect and reconnect)',
  'Clear the cache and retry the operation',
  'Update to the latest version if available',
])}

3. **Still stuck?** - ${pick([
  "I'll escalate to our Engineer for a deeper technical investigation",
  "Let me pull in more context and try an alternative approach",
  "We can try a different path - sometimes the workaround is faster",
])}

${isQuestion ? `To directly answer your question: ` : ''}${pick([
  'This is usually resolved with step 2. Let me know if it works!',
  "Most users find the quick check catches the issue. Try that first.",
  "Start with step 1 - 80% of cases resolve there.",
])}

Need more specific help? Just describe what you see and I'll narrow it down.`
        : `**Support: ${subject.slice(0, 50)}**

${pick([
  `Everything looks healthy on our end. Here's a quick status:`,
  `Good news - no issues detected. Here's what I can tell you:`,
  `Your setup is looking solid. Quick overview:`,
])}

- **System status**: All green
- **Configuration**: Valid and up to date
- **Connections**: Active and responding

${isQuestion
  ? `To answer your question about ${subject.slice(0, 30)}: ${pick(['Yes, that should work as expected', 'The documentation covers this in detail', 'Here are the steps to get that set up'])}. Let me know if you need more detail.`
  : `Is there anything specific you'd like help with? I'm here for troubleshooting, configuration, or general guidance.`
}`,
    };
  },
};

/**
 * Build an execution plan for a user message.
 * Determines which agents handle the work, in what order, and with what delegations.
 * Now supports collaboration chains where multiple agents contribute.
 */
export function buildExecutionPlan(
  userMessage: string,
  primaryAgentId: string,
  agents: Map<string, { agent: Agent }>,
  context?: string,
): ExecutionPlan {
  const primaryEntry = agents.get(primaryAgentId);
  if (!primaryEntry) {
    return {
      id: `plan_${Date.now()}`,
      userMessage,
      steps: [],
      primaryAgent: primaryAgentId,
      delegations: [],
      collaborators: [],
      finalResponse: 'No agent available to handle this request.',
      totalDuration: 0,
    };
  }

  const primary = primaryEntry.agent;
  const responder = roleResponders[primary.role];
  const result = responder(userMessage, context);
  const steps: ExecutionStep[] = [];
  const delegations: { from: string; to: string; reason: string }[] = [];
  const collaborators: string[] = [];
  let currentTime = 0;

  // Step 1: Coordinator thinks (if primary is not coordinator)
  const coordinator = Array.from(agents.values()).find(a => a.agent.role === 'coordinator');
  if (coordinator && coordinator.agent.id !== primaryAgentId) {
    const thinkDuration = 600 + Math.random() * 400;
    steps.push({
      agentId: coordinator.agent.id,
      agentName: coordinator.agent.name,
      agentEmoji: coordinator.agent.emoji,
      type: 'thinking',
      content: `Routing to ${primary.name}: "${userMessage.slice(0, 60)}${userMessage.length > 60 ? '...' : ''}"`,
      duration: thinkDuration,
      timestamp: currentTime,
    });
    currentTime += thinkDuration;

    // Coordinator delegates
    steps.push({
      agentId: coordinator.agent.id,
      agentName: coordinator.agent.name,
      agentEmoji: coordinator.agent.emoji,
      type: 'delegating',
      content: `Handing off to ${primary.emoji} ${primary.name}`,
      duration: 300,
      timestamp: currentTime,
    });
    currentTime += 300;
  }

  // Step 2: Primary agent thinks
  const thinkDuration = 800 + Math.random() * 600;
  steps.push({
    agentId: primary.id,
    agentName: primary.name,
    agentEmoji: primary.emoji,
    type: 'thinking',
    content: result.thinking,
    duration: thinkDuration,
    timestamp: currentTime,
  });
  currentTime += thinkDuration;

  // Step 3: Check for delegation
  if (result.shouldDelegate) {
    const delegateTarget = Array.from(agents.values()).find(
      a => a.agent.role === result.shouldDelegate!.toRole && a.agent.enabled
    );

    if (delegateTarget) {
      // Primary delegates
      steps.push({
        agentId: primary.id,
        agentName: primary.name,
        agentEmoji: primary.emoji,
        type: 'delegating',
        content: `Delegating to ${delegateTarget.agent.emoji} ${delegateTarget.agent.name}: ${result.shouldDelegate.reason}`,
        duration: 400,
        timestamp: currentTime,
      });
      currentTime += 400;

      delegations.push({
        from: primary.id,
        to: delegateTarget.agent.id,
        reason: result.shouldDelegate.reason,
      });

      // Delegated agent works
      const delegateResponder = roleResponders[delegateTarget.agent.role];
      const delegateResult = delegateResponder(userMessage);

      const delegateThink = 800 + Math.random() * 800;
      steps.push({
        agentId: delegateTarget.agent.id,
        agentName: delegateTarget.agent.name,
        agentEmoji: delegateTarget.agent.emoji,
        type: 'thinking',
        content: delegateResult.thinking,
        duration: delegateThink,
        timestamp: currentTime,
      });
      currentTime += delegateThink;

      const delegateWork = 1200 + Math.random() * 1000;
      steps.push({
        agentId: delegateTarget.agent.id,
        agentName: delegateTarget.agent.name,
        agentEmoji: delegateTarget.agent.emoji,
        type: 'working',
        content: delegateResult.response,
        duration: delegateWork,
        timestamp: currentTime,
      });
      currentTime += delegateWork;

      // Back to primary with results
      steps.push({
        agentId: primary.id,
        agentName: primary.name,
        agentEmoji: primary.emoji,
        type: 'working',
        content: `Incorporating ${delegateTarget.agent.name}'s findings into my response...`,
        duration: 600,
        timestamp: currentTime,
      });
      currentTime += 600;
    }
  }

  // Step 3b: Check for collaboration (multiple agents working together)
  if (result.shouldCollaborate) {
    for (const role of result.shouldCollaborate.withRoles) {
      const collaborator = Array.from(agents.values()).find(
        a => a.agent.role === role && a.agent.enabled
      );

      if (collaborator) {
        collaborators.push(collaborator.agent.id);

        steps.push({
          agentId: primary.id,
          agentName: primary.name,
          agentEmoji: primary.emoji,
          type: 'delegating',
          content: `Collaborating with ${collaborator.agent.emoji} ${collaborator.agent.name}: ${result.shouldCollaborate!.reason}`,
          duration: 300,
          timestamp: currentTime,
        });
        currentTime += 300;

        // Collaborator works in parallel (but rendered sequentially for UX)
        const collabResponder = roleResponders[collaborator.agent.role];
        const collabResult = collabResponder(userMessage);

        const collabThink = 600 + Math.random() * 600;
        steps.push({
          agentId: collaborator.agent.id,
          agentName: collaborator.agent.name,
          agentEmoji: collaborator.agent.emoji,
          type: 'thinking',
          content: collabResult.thinking,
          duration: collabThink,
          timestamp: currentTime,
        });
        currentTime += collabThink;

        const collabWork = 1000 + Math.random() * 800;
        steps.push({
          agentId: collaborator.agent.id,
          agentName: collaborator.agent.name,
          agentEmoji: collaborator.agent.emoji,
          type: 'working',
          content: collabResult.response,
          duration: collabWork,
          timestamp: currentTime,
        });
        currentTime += collabWork;
      }
    }

    // Primary synthesizes
    if (collaborators.length > 0) {
      steps.push({
        agentId: primary.id,
        agentName: primary.name,
        agentEmoji: primary.emoji,
        type: 'working',
        content: `Synthesizing contributions from team members...`,
        duration: 500,
        timestamp: currentTime,
      });
      currentTime += 500;
    }
  }

  // Step 4: Primary agent works
  const workDuration = 1200 + Math.random() * 1200;
  steps.push({
    agentId: primary.id,
    agentName: primary.name,
    agentEmoji: primary.emoji,
    type: 'working',
    content: result.response,
    duration: workDuration,
    timestamp: currentTime,
  });
  currentTime += workDuration;

  // Step 5: Coordinator reviews (if there is one and it's not the primary)
  if (coordinator && coordinator.agent.id !== primaryAgentId) {
    const reviewDuration = 500 + Math.random() * 500;
    const reviewVerdict = pick([
      `Reviewing ${primary.name}'s output... Quality check passed.`,
      `Reviewing ${primary.name}'s work... Looks solid, delivering to user.`,
      `QA check on ${primary.name}'s response... Approved.`,
    ]);
    steps.push({
      agentId: coordinator.agent.id,
      agentName: coordinator.agent.name,
      agentEmoji: coordinator.agent.emoji,
      type: 'reviewing',
      content: reviewVerdict,
      duration: reviewDuration,
      timestamp: currentTime,
    });
    currentTime += reviewDuration;
  }

  // Final complete step
  steps.push({
    agentId: primary.id,
    agentName: primary.name,
    agentEmoji: primary.emoji,
    type: 'complete',
    content: result.response,
    duration: 0,
    timestamp: currentTime,
  });

  return {
    id: `plan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userMessage,
    steps,
    primaryAgent: primaryAgentId,
    delegations,
    collaborators,
    finalResponse: result.response,
    totalDuration: currentTime,
  };
}

/**
 * Execute a plan step by step, calling back on each step.
 * Returns a cleanup function to cancel execution.
 */
export function executePlan(
  plan: ExecutionPlan,
  onStep: (step: ExecutionStep, index: number) => void,
  onComplete: (plan: ExecutionPlan) => void,
): () => void {
  let cancelled = false;
  const timeouts: ReturnType<typeof setTimeout>[] = [];

  let cumulativeDelay = 0;

  for (let i = 0; i < plan.steps.length; i++) {
    const step = plan.steps[i];
    cumulativeDelay += (i === 0 ? 0 : plan.steps[i - 1].duration);

    const timeout = setTimeout(() => {
      if (cancelled) return;
      onStep(step, i);

      if (i === plan.steps.length - 1) {
        onComplete(plan);
      }
    }, cumulativeDelay);

    timeouts.push(timeout);
  }

  return () => {
    cancelled = true;
    for (const t of timeouts) clearTimeout(t);
  };
}
