#!/usr/bin/env node

/**
 * Simple Crew Example
 * 
 * Demonstrates how to use ClawCrew to orchestrate a team of agents.
 * 
 * Usage:
 *   node examples/simple-crew.js
 */

// For now, using require since we're in JS
// The TypeScript files would need to be compiled first

const fs = require('fs');
const path = require('path');

// Simulated CrewEngine (JS version for demo)
class SimpleCrewEngine {
  constructor(name, agents) {
    this.name = name;
    this.agents = agents;
    this.coordinatorId = agents[0]?.id;
    this.messages = [];
  }

  getAgent(id) {
    return this.agents.find(a => a.id === id);
  }

  routeMessage(content) {
    const contentLower = content.toLowerCase();
    
    // Simple keyword routing
    for (const agent of this.agents) {
      for (const keyword of agent.keywords || []) {
        if (contentLower.includes(keyword)) {
          return agent.id;
        }
      }
    }
    
    // Default to coordinator
    return this.coordinatorId;
  }

  sendMessage(from, to, content) {
    const msg = {
      id: Math.random().toString(36).substring(7),
      from,
      to,
      content,
      timestamp: new Date(),
    };
    this.messages.push(msg);
    console.log(`  ${from} → ${to}: ${content.substring(0, 60)}...`);
    return msg;
  }
}

// X-Men Crew
const xmenCrew = new SimpleCrewEngine('X-Men Crew', [
  {
    id: 'gambit',
    name: 'Gambit',
    emoji: '🃏',
    role: 'coordinator',
    keywords: ['help', 'coordinate', 'plan', 'manage'],
  },
  {
    id: 'beast',
    name: 'Beast',
    emoji: '🔬',
    role: 'researcher',
    keywords: ['research', 'analyze', 'investigate', 'prd', 'document'],
  },
  {
    id: 'wolverine',
    name: 'Wolverine',
    emoji: '🐺',
    role: 'engineer',
    keywords: ['build', 'code', 'fix', 'deploy', 'implement'],
  },
  {
    id: 'magneto',
    name: 'Magneto',
    emoji: '🧲',
    role: 'qa',
    keywords: ['test', 'validate', 'review', 'check', 'approve'],
  },
]);

// Demo scenarios
console.log(`
🃏 ClawCrew Demo
────────────────

Crew: ${xmenCrew.name}
Agents: ${xmenCrew.agents.map(a => `${a.emoji} ${a.name}`).join(', ')}
`);

// Scenario 1: Route a research request
console.log('Scenario 1: Research Request');
console.log('User: "Can you research the best practices for API design?"');
const researchTarget = xmenCrew.routeMessage('research the best practices for API design');
const researchAgent = xmenCrew.getAgent(researchTarget);
console.log(`→ Routed to: ${researchAgent.emoji} ${researchAgent.name} (${researchAgent.role})`);
console.log('');

// Scenario 2: Route a build request
console.log('Scenario 2: Build Request');
console.log('User: "Build me a REST API for user management"');
const buildTarget = xmenCrew.routeMessage('build me a REST API for user management');
const buildAgent = xmenCrew.getAgent(buildTarget);
console.log(`→ Routed to: ${buildAgent.emoji} ${buildAgent.name} (${buildAgent.role})`);
console.log('');

// Scenario 3: Route a validation request
console.log('Scenario 3: Validation Request');
console.log('User: "Please review and test this code"');
const testTarget = xmenCrew.routeMessage('please review and test this code');
const testAgent = xmenCrew.getAgent(testTarget);
console.log(`→ Routed to: ${testAgent.emoji} ${testAgent.name} (${testAgent.role})`);
console.log('');

// Scenario 4: General request (goes to coordinator)
console.log('Scenario 4: General Request');
console.log('User: "What should we work on next?"');
const generalTarget = xmenCrew.routeMessage('what should we work on next');
const generalAgent = xmenCrew.getAgent(generalTarget);
console.log(`→ Routed to: ${generalAgent.emoji} ${generalAgent.name} (${generalAgent.role})`);
console.log('');

// Scenario 5: Simulated workflow
console.log('Scenario 5: Full Workflow Simulation');
console.log('Task: "Build a dashboard feature"');
console.log('');

// Step 1: User asks coordinator
xmenCrew.sendMessage('user', 'gambit', 'Build a dashboard feature');

// Step 2: Gambit delegates to Beast for PRD
xmenCrew.sendMessage('gambit', 'beast', 'Write PRD for dashboard feature');

// Step 3: Beast completes PRD, notifies Gambit
xmenCrew.sendMessage('beast', 'gambit', 'PRD complete: Dashboard will show metrics, charts, and alerts');

// Step 4: Gambit delegates to Wolverine for implementation
xmenCrew.sendMessage('gambit', 'wolverine', 'Implement dashboard per PRD. React + Chart.js.');

// Step 5: Wolverine completes, sends for review
xmenCrew.sendMessage('wolverine', 'magneto', 'Dashboard implemented. Ready for review.');

// Step 6: Magneto validates
xmenCrew.sendMessage('magneto', 'gambit', 'Dashboard approved. All tests pass.');

// Step 7: Gambit reports to user
xmenCrew.sendMessage('gambit', 'user', 'Dashboard feature complete and validated! 🎉');

console.log('');
console.log(`Total messages: ${xmenCrew.messages.length}`);
console.log('');
console.log('─────────────────');
console.log('Demo complete! 🃏');
console.log('');
console.log('In production, each sendMessage would trigger a real OpenClaw session.');
console.log('The bridge (lib/openclaw-bridge.ts) handles the actual integration.');
