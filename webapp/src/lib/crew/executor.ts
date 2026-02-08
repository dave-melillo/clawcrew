/**
 * ClawCrew Task Executor
 *
 * Simulates realistic agent behavior for demo purposes.
 * Each agent role produces role-specific responses, can delegate to others,
 * and supports multi-step task pipelines.
 *
 * When real LLM integration lands, this becomes the adapter layer.
 */

import type { Agent, AgentRole } from '@/types';
import { createMessage, createHandoff } from './protocol';
import type { CrewMessage, HandoffRequest } from './protocol';

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
  finalResponse: string;
  totalDuration: number;
}

/** Role-specific response generators */
const roleResponders: Record<AgentRole, (input: string) => {
  thinking: string;
  response: string;
  shouldDelegate?: { toRole: AgentRole; reason: string };
}> = {
  coordinator: (input: string) => ({
    thinking: 'Analyzing request and determining best routing...',
    response: `I've reviewed this request and routed it to the appropriate specialist. Summary: "${input.slice(0, 80)}${input.length > 80 ? '...' : ''}"`,
  }),

  engineer: (input: string) => {
    const hasCode = /code|build|fix|implement|debug|script|function|api|bug|deploy|test/i.test(input);
    const hasResearch = /research|why|compare|analyze|investigate/i.test(input);

    if (hasResearch) {
      return {
        thinking: 'This needs research first before implementation...',
        response: 'I can build this, but we need a technical spec first.',
        shouldDelegate: { toRole: 'researcher', reason: 'Need technical research before implementation' },
      };
    }

    return {
      thinking: 'Breaking down the technical requirements...',
      response: hasCode
        ? `Technical implementation plan:\n\n1. **Setup**: Initialize project structure and dependencies\n2. **Core Logic**: Implement the main functionality\n3. **Testing**: Write unit tests and integration checks\n4. **Review**: Self-review for edge cases\n\nEstimated complexity: ${input.length > 100 ? 'Medium-High' : 'Low-Medium'}\nReady to implement on your go.`
        : `I can help with the technical side of this. Here's my approach:\n- Assess current state\n- Identify the minimal changes needed\n- Implement with clean, tested code\n\nShall I proceed?`,
    };
  },

  researcher: (input: string) => {
    const hasData = /data|metrics|numbers|stats|trends/i.test(input);
    if (hasData) {
      return {
        thinking: 'This is more of a data analysis task...',
        response: 'I can research the qualitative aspects, but the quantitative analysis should go to our Analyst.',
        shouldDelegate: { toRole: 'analyst', reason: 'Quantitative analysis needed' },
      };
    }

    return {
      thinking: 'Diving deep into research and analysis...',
      response: `Research findings:\n\n**Key Insights:**\n- Analyzed the request from multiple angles\n- Cross-referenced available knowledge\n- Identified 3 viable approaches\n\n**Recommendation:** Based on the analysis, the most effective approach is to start with a focused scope and iterate. This balances risk with speed of delivery.\n\n**Trade-offs to consider:**\n- Speed vs thoroughness\n- Simplicity vs flexibility\n- Cost vs capability`,
    };
  },

  creative: (input: string) => ({
    thinking: 'Exploring creative directions and visual concepts...',
    response: `Creative direction:\n\n**Concept:** Modern and clean with a focus on clarity\n**Color palette:** Dynamic gradients that convey energy and trust\n**Typography:** Sans-serif for headings, readable body text\n**Visual style:** Minimal with purposeful use of color and space\n\nI can develop this further into mockups or detailed specs. Want me to explore a specific direction?`,
  }),

  scheduler: (input: string) => {
    const hasTiming = /remind|schedule|every|daily|weekly|calendar|when|morning|evening/i.test(input);
    return {
      thinking: 'Evaluating timing and scheduling requirements...',
      response: hasTiming
        ? `Schedule configured:\n\n- **Frequency**: Based on your request\n- **Timezone**: Auto-detected from your profile\n- **Delivery**: Will be sent to your active channels\n- **Status**: Ready to activate\n\nI'll make sure this runs reliably. You can adjust the timing anytime.`
        : `I can help organize the timing for this. Would you like me to:\n- Set up a one-time reminder?\n- Create a recurring schedule?\n- Build an automated briefing?\n\nJust let me know the timing details.`,
    };
  },

  writer: (input: string) => {
    const hasContent = /write|draft|compose|email|blog|document|letter|copy|post/i.test(input);
    return {
      thinking: 'Crafting the right tone and structure...',
      response: hasContent
        ? `Here's my draft:\n\n---\n\n*[Crafted content based on your request]*\n\nI've matched the tone to your audience and kept it concise but complete. Key elements:\n- Clear opening hook\n- Structured body with key points\n- Strong call to action\n\nWant me to adjust the tone, length, or focus?`
        : `I can help with the written communication side. I'll focus on:\n- Clear, engaging language\n- Appropriate tone for your audience\n- Proper structure and flow\n\nWhat format do you need? (email, blog post, documentation, etc.)`,
    };
  },

  analyst: (input: string) => ({
    thinking: 'Processing data and generating insights...',
    response: `Analysis complete:\n\n**Summary:**\n- Processed the available data points\n- Identified key trends and patterns\n- Generated actionable insights\n\n**Key Metrics:**\n- Performance: Trending positive\n- Efficiency: Room for 15-20% improvement\n- Risk: Low with current approach\n\n**Recommendation:** Focus on the top 3 drivers for maximum impact. I can break this down further if needed.`,
  }),

  support: (input: string) => {
    const hasIssue = /help|problem|issue|broken|error|how do i|can't|doesn't work/i.test(input);
    return {
      thinking: 'Understanding the user\'s situation and finding a solution...',
      response: hasIssue
        ? `I'm here to help! Here's what I'd suggest:\n\n1. **Quick check**: Make sure everything is configured correctly\n2. **Common fix**: This is usually resolved by refreshing the connection\n3. **If that doesn't work**: I'll escalate to our Engineer for a deeper look\n\nLet me know if the quick fix works, or if you need more detailed help!`
        : `Happy to help! Here's what you need to know:\n\n- The system is working as expected\n- Your configuration looks good\n- If you run into any issues, just ask\n\nIs there anything specific you'd like help with?`,
    };
  },
};

/**
 * Build an execution plan for a user message.
 * Determines which agents handle the work, in what order, and with what delegations.
 */
export function buildExecutionPlan(
  userMessage: string,
  primaryAgentId: string,
  agents: Map<string, { agent: Agent }>,
): ExecutionPlan {
  const primaryEntry = agents.get(primaryAgentId);
  if (!primaryEntry) {
    return {
      id: `plan_${Date.now()}`,
      userMessage,
      steps: [],
      primaryAgent: primaryAgentId,
      delegations: [],
      finalResponse: 'No agent available to handle this request.',
      totalDuration: 0,
    };
  }

  const primary = primaryEntry.agent;
  const responder = roleResponders[primary.role];
  const result = responder(userMessage);
  const steps: ExecutionStep[] = [];
  const delegations: { from: string; to: string; reason: string }[] = [];
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
      content: `Routing to ${primary.name}: "${userMessage.slice(0, 60)}..."`,
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
        content: `Incorporating ${delegateTarget.agent.name}'s work into my response...`,
        duration: 600,
        timestamp: currentTime,
      });
      currentTime += 600;
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
    steps.push({
      agentId: coordinator.agent.id,
      agentName: coordinator.agent.name,
      agentEmoji: coordinator.agent.emoji,
      type: 'reviewing',
      content: `Reviewing ${primary.name}'s output... Looks good.`,
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
