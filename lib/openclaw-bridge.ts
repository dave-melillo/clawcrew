/**
 * OpenClaw Bridge - Connects CrewEngine to actual OpenClaw sessions
 * 
 * This module provides the integration between ClawCrew's orchestration
 * and OpenClaw's session management.
 */

import { CrewEngine, CrewAgent, CrewTask, CrewMessage } from './crew-engine';

export interface OpenClawConfig {
  gatewayUrl?: string;
  gatewayToken?: string;
  defaultModel?: string;
}

export interface SessionInfo {
  sessionKey: string;
  agentId: string;
  status: 'active' | 'idle' | 'completed';
  lastActivity?: Date;
}

/**
 * OpenClawBridge - Manages the connection between ClawCrew and OpenClaw
 */
export class OpenClawBridge {
  private engine: CrewEngine;
  private config: OpenClawConfig;
  private sessions: Map<string, SessionInfo> = new Map();

  constructor(engine: CrewEngine, config: OpenClawConfig = {}) {
    this.engine = engine;
    this.config = {
      gatewayUrl: config.gatewayUrl || process.env.OPENCLAW_GATEWAY_URL,
      gatewayToken: config.gatewayToken || process.env.OPENCLAW_GATEWAY_TOKEN,
      defaultModel: config.defaultModel || 'anthropic/claude-sonnet-4-5',
    };
  }

  /**
   * Spawn an agent session for a specific crew member
   */
  async spawnAgent(agentId: string, task?: string): Promise<SessionInfo | null> {
    const agent = this.engine.getAgent(agentId);
    if (!agent) {
      console.error(`Agent not found: ${agentId}`);
      return null;
    }

    // Build the agent context from their soul/personality
    const systemContext = this.buildAgentContext(agent);

    // This would call OpenClaw's sessions_spawn
    // For now, we simulate the interface
    const sessionKey = `crew:${agent.id}:${Date.now()}`;

    const session: SessionInfo = {
      sessionKey,
      agentId: agent.id,
      status: 'active',
      lastActivity: new Date(),
    };

    this.sessions.set(agent.id, session);

    console.log(`🚀 Spawned session for ${agent.emoji} ${agent.name}: ${sessionKey}`);

    if (task) {
      await this.sendTask(agentId, task);
    }

    return session;
  }

  /**
   * Build the agent's system context from their personality
   */
  private buildAgentContext(agent: CrewAgent): string {
    return `
# Agent: ${agent.name} ${agent.emoji}

## Role
${agent.role}

## Personality
${agent.soul}

## Capabilities
${agent.capabilities.join(', ')}

## Routing Keywords
${agent.routingKeywords.join(', ')}

## Instructions
You are ${agent.name}, part of the ClawCrew team. Stay in character.
When you complete a task, report back clearly.
If you need help from another agent, say "DELEGATE TO [agent-role]: [task]"
`.trim();
  }

  /**
   * Send a task to a specific agent
   */
  async sendTask(agentId: string, task: string): Promise<boolean> {
    const session = this.sessions.get(agentId);
    if (!session) {
      console.error(`No active session for agent: ${agentId}`);
      return false;
    }

    const agent = this.engine.getAgent(agentId);
    console.log(`📤 Sending task to ${agent?.emoji} ${agent?.name}: ${task.substring(0, 50)}...`);

    // This would call OpenClaw's sessions_send
    // sessions_send({ sessionKey: session.sessionKey, message: task })

    // Record the message in crew engine
    this.engine.sendMessage({
      from: 'user',
      to: agentId,
      type: 'task',
      content: task,
    });

    return true;
  }

  /**
   * Route a message to the best agent based on content
   */
  async routeMessage(content: string): Promise<string> {
    const targetAgentId = this.engine.routeMessage(content);
    
    if (!targetAgentId) {
      console.warn('No suitable agent found for message');
      return '';
    }

    // Spawn session if needed
    if (!this.sessions.has(targetAgentId)) {
      await this.spawnAgent(targetAgentId);
    }

    await this.sendTask(targetAgentId, content);
    return targetAgentId;
  }

  /**
   * Delegate a task from one agent to another
   */
  async delegate(fromAgentId: string, toAgentId: string, task: string): Promise<boolean> {
    const fromAgent = this.engine.getAgent(fromAgentId);
    const toAgent = this.engine.getAgent(toAgentId);

    if (!fromAgent || !toAgent) {
      console.error('Invalid agent IDs for delegation');
      return false;
    }

    console.log(`🔄 ${fromAgent.emoji} ${fromAgent.name} delegating to ${toAgent.emoji} ${toAgent.name}`);

    // Record delegation
    this.engine.sendMessage({
      from: fromAgentId,
      to: toAgentId,
      type: 'delegate',
      content: task,
    });

    // Spawn target if needed
    if (!this.sessions.has(toAgentId)) {
      await this.spawnAgent(toAgentId);
    }

    // Send the task with delegation context
    const delegationMessage = `[Delegated from ${fromAgent.name}]\n\n${task}`;
    await this.sendTask(toAgentId, delegationMessage);

    return true;
  }

  /**
   * Get status of all active sessions
   */
  getSessionStatus(): Record<string, SessionInfo> {
    const status: Record<string, SessionInfo> = {};
    this.sessions.forEach((session, agentId) => {
      status[agentId] = session;
    });
    return status;
  }

  /**
   * Broadcast a message to all agents
   */
  async broadcast(message: string): Promise<void> {
    const crew = this.engine.getCrew();
    
    for (const agent of crew.agents) {
      if (this.sessions.has(agent.id)) {
        await this.sendTask(agent.id, message);
      }
    }
  }

  /**
   * Shutdown all agent sessions
   */
  async shutdown(): Promise<void> {
    console.log('🛑 Shutting down all agent sessions...');
    
    for (const [agentId, session] of this.sessions) {
      const agent = this.engine.getAgent(agentId);
      console.log(`  Closing ${agent?.emoji} ${agent?.name}...`);
      session.status = 'completed';
    }

    this.sessions.clear();
  }
}

/**
 * Create a bridge from a crew template
 */
export function createBridge(templateId: string, config?: OpenClawConfig): OpenClawBridge {
  const engine = CrewEngine.fromTemplate(templateId);
  return new OpenClawBridge(engine, config);
}

/**
 * Quick start: Create an X-Men crew bridge
 */
export function createXMenCrew(config?: OpenClawConfig): OpenClawBridge {
  return createBridge('xmen', config);
}

export default OpenClawBridge;
