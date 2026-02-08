/**
 * ClawCrew Team Templates
 *
 * Pre-built crew compositions for common use cases.
 * Users pick a template, we assemble the team.
 *
 * This is the "Bits gets you one. ClawCrew gets you a team." differentiator.
 */

export interface CrewTemplate {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  agentIds: string[];   // references to agent-templates.ts IDs
  coordinatorId: string;
  recommended: boolean;
  useCases: string[];
  estimatedCost: string; // monthly estimate
  complexity: 'starter' | 'standard' | 'advanced';
}

export const crewTemplates: CrewTemplate[] = [
  {
    id: 'solo-plus',
    name: 'Solo+',
    tagline: 'One agent with a coordinator backup',
    description: 'Perfect for getting started. A coordinator handles routing while you pick one specialist to do the heavy lifting. Add more agents anytime.',
    icon: '1+',
    agentIds: ['coordinator'],  // user picks one more
    coordinatorId: 'coordinator',
    recommended: false,
    useCases: [
      'Personal projects',
      'Learning ClawCrew',
      'Simple automation',
    ],
    estimatedCost: '$5-10/mo',
    complexity: 'starter',
  },
  {
    id: 'startup-crew',
    name: 'Startup Crew',
    tagline: 'Build fast, ship faster',
    description: 'A lean team for builders. Coordinator routes tasks between an Engineer for code, a Researcher for deep dives, and a Creative for design work.',
    icon: 'SC',
    agentIds: ['coordinator', 'engineer', 'researcher', 'creative'],
    coordinatorId: 'coordinator',
    recommended: true,
    useCases: [
      'Software development',
      'Product building',
      'Technical projects',
      'Side projects',
    ],
    estimatedCost: '$15-25/mo',
    complexity: 'standard',
  },
  {
    id: 'content-crew',
    name: 'Content Crew',
    tagline: 'Create, research, publish',
    description: 'Built for content creators. A Writer crafts the words, a Researcher provides the facts, and a Creative handles visuals. Coordinator keeps it all flowing.',
    icon: 'CC',
    agentIds: ['coordinator', 'writer', 'researcher', 'creative'],
    coordinatorId: 'coordinator',
    recommended: true,
    useCases: [
      'Blog & newsletter writing',
      'Social media management',
      'Marketing content',
      'Documentation',
    ],
    estimatedCost: '$15-25/mo',
    complexity: 'standard',
  },
  {
    id: 'dev-team',
    name: 'Dev Team',
    tagline: 'Ship quality code',
    description: 'A technical crew optimized for software teams. Engineer builds, Analyst reviews metrics, Support handles user issues, and Coordinator keeps priorities straight.',
    icon: 'DT',
    agentIds: ['coordinator', 'engineer', 'analyst', 'support'],
    coordinatorId: 'coordinator',
    recommended: false,
    useCases: [
      'SaaS development',
      'Open source projects',
      'API development',
      'DevOps workflows',
    ],
    estimatedCost: '$15-25/mo',
    complexity: 'standard',
  },
  {
    id: 'business-ops',
    name: 'Business Ops',
    tagline: 'Run your business on autopilot',
    description: 'For small business owners who need operational support. Scheduler keeps you organized, Analyst tracks the numbers, Writer handles comms, Support manages clients.',
    icon: 'BO',
    agentIds: ['coordinator', 'scheduler', 'analyst', 'writer', 'support'],
    coordinatorId: 'coordinator',
    recommended: false,
    useCases: [
      'Small business management',
      'Client management',
      'Operations tracking',
      'Business reporting',
    ],
    estimatedCost: '$20-35/mo',
    complexity: 'advanced',
  },
  {
    id: 'full-stack',
    name: 'Full Stack',
    tagline: 'The whole team',
    description: 'All 8 agents working together. Maximum capability, maximum coordination. The coordinator routes everything to the right specialist automatically.',
    icon: 'FS',
    agentIds: ['coordinator', 'engineer', 'researcher', 'creative', 'scheduler', 'writer', 'analyst', 'support'],
    coordinatorId: 'coordinator',
    recommended: false,
    useCases: [
      'Enterprise workflows',
      'Complex projects',
      'Full business automation',
      'Agency operations',
    ],
    estimatedCost: '$35-60/mo',
    complexity: 'advanced',
  },
];

export function getCrewTemplate(id: string): CrewTemplate | undefined {
  return crewTemplates.find(t => t.id === id);
}

export function getRecommendedTemplates(): CrewTemplate[] {
  return crewTemplates.filter(t => t.recommended);
}

export function getTemplatesByComplexity(complexity: CrewTemplate['complexity']): CrewTemplate[] {
  return crewTemplates.filter(t => t.complexity === complexity);
}
