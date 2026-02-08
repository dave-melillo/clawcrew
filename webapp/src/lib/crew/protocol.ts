/**
 * ClawCrew Agent Communication Protocol
 *
 * Defines the message format and routing rules for agent-to-agent communication.
 * This is THE differentiator - Bits gives you one agent, we give you a team.
 */

export type MessageType =
  | 'task'          // New work assignment
  | 'result'        // Completed work
  | 'delegate'      // Hand off to another agent
  | 'status'        // Status update
  | 'review'        // Request review from another agent
  | 'feedback'      // Review feedback
  | 'escalate';     // Escalate to coordinator

export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent';

export type AgentStatus = 'idle' | 'working' | 'delegating' | 'reviewing' | 'blocked' | 'offline';

export interface CrewMessage {
  id: string;
  from: string;           // agent ID
  to: string;             // agent ID or 'coordinator' or 'broadcast'
  type: MessageType;
  priority: MessagePriority;
  content: string;
  context: MessageContext;
  parentId?: string;       // thread/conversation tracking
  timestamp: number;
}

export interface MessageContext {
  taskId?: string;
  originalRequest?: string;   // what the user originally asked
  previousResults?: string[]; // results from earlier in the chain
  metadata?: Record<string, unknown>;
}

export interface RoutingRule {
  agentId: string;
  keywords: string[];
  patterns: RegExp[];
  priority: number;
  capabilities: string[];
}

export interface HandoffRequest {
  fromAgent: string;
  toAgent: string;
  reason: string;
  context: MessageContext;
  preserveHistory: boolean;
}

/**
 * Route an incoming message to the best agent based on content analysis.
 * The coordinator uses this to decide who handles what.
 */
export function routeMessage(
  content: string,
  rules: RoutingRule[]
): { agentId: string; confidence: number; reason: string } | null {
  const contentLower = content.toLowerCase();

  let bestMatch: { agentId: string; score: number; reason: string } | null = null;

  for (const rule of rules) {
    let score = 0;
    const matchedKeywords: string[] = [];

    // Keyword matching
    for (const keyword of rule.keywords) {
      if (contentLower.includes(keyword.toLowerCase())) {
        score += 10;
        matchedKeywords.push(keyword);
      }
    }

    // Pattern matching
    for (const pattern of rule.patterns) {
      if (pattern.test(content)) {
        score += 20;
      }
    }

    // Priority boost
    score += (10 - rule.priority);

    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = {
        agentId: rule.agentId,
        score,
        reason: matchedKeywords.length > 0
          ? `Matched keywords: ${matchedKeywords.join(', ')}`
          : 'Matched routing pattern',
      };
    }
  }

  if (!bestMatch) return null;

  return {
    agentId: bestMatch.agentId,
    confidence: Math.min(bestMatch.score / 50, 1), // normalize to 0-1
    reason: bestMatch.reason,
  };
}

/**
 * Create a standardized crew message.
 */
export function createMessage(
  from: string,
  to: string,
  type: MessageType,
  content: string,
  context: Partial<MessageContext> = {},
  parentId?: string
): CrewMessage {
  return {
    id: generateMessageId(),
    from,
    to,
    type,
    priority: 'normal',
    content,
    context: {
      ...context,
    },
    parentId,
    timestamp: Date.now(),
  };
}

/**
 * Create a handoff request for agent-to-agent delegation.
 */
export function createHandoff(
  fromAgent: string,
  toAgent: string,
  reason: string,
  context: MessageContext
): HandoffRequest {
  return {
    fromAgent,
    toAgent,
    reason,
    context,
    preserveHistory: true,
  };
}

function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}
