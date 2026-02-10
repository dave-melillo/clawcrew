const fs = require('fs-extra');
const path = require('path');
const os = require('os');

/**
 * Generate configuration files for ClawCrew
 */
async function generateConfig(config) {
  const { agents, apiKey, installPath } = config;

  // Resolve home directory in path
  const resolvedPath = installPath.replace(/^~/, os.homedir());

  // Ensure directory exists
  await fs.ensureDir(resolvedPath);

  // Generate agents.yaml
  const agentsYaml = generateAgentsYaml(agents);
  await fs.writeFile(
    path.join(resolvedPath, 'agents.yaml'),
    agentsYaml,
    'utf8'
  );

  // Generate models.yaml
  const modelsYaml = generateModelsYaml();
  await fs.writeFile(
    path.join(resolvedPath, 'models.yaml'),
    modelsYaml,
    'utf8'
  );

  // Generate .env file (for API key)
  const envContent = `ANTHROPIC_API_KEY=${apiKey}\n`;
  await fs.writeFile(
    path.join(resolvedPath, '.env'),
    envContent,
    'utf8'
  );

  // Generate AGENTS.md with personality profiles
  const agentsMd = generateAgentsMd(agents);
  await fs.writeFile(
    path.join(resolvedPath, 'AGENTS.md'),
    agentsMd,
    'utf8'
  );

  // Generate README
  const readme = generateReadme(agents, resolvedPath);
  await fs.writeFile(
    path.join(resolvedPath, 'README.md'),
    readme,
    'utf8'
  );

  return resolvedPath;
}

/**
 * Generate agents.yaml configuration
 */
function generateAgentsYaml(agents) {
  const yaml = [];
  yaml.push('version: 2.0');
  yaml.push('coordinator: coordinator');
  yaml.push('');
  yaml.push('agents:');

  agents.forEach(agent => {
    yaml.push(`  ${agent.id}:`);
    yaml.push(`    name: ${agent.name}`);
    yaml.push(`    role: ${agent.role.toLowerCase().replace(/\s+/g, '_')}`);
    yaml.push(`    model: ${agent.model}`);
    yaml.push(`    enabled: true`);
    yaml.push('');
  });

  return yaml.join('\n');
}

/**
 * Generate models.yaml configuration
 */
function generateModelsYaml() {
  const yaml = [];
  yaml.push('providers:');
  yaml.push('  anthropic:');
  yaml.push('    api_key_env: ANTHROPIC_API_KEY');
  yaml.push('    models:');
  yaml.push('      claude-sonnet-4-5:');
  yaml.push('        max_tokens: 8192');
  yaml.push('        temperature: 1.0');
  yaml.push('      claude-haiku-4-5:');
  yaml.push('        max_tokens: 4096');
  yaml.push('        temperature: 1.0');
  yaml.push('');
  yaml.push('default_model: claude-sonnet-4-5');

  return yaml.join('\n');
}

/**
 * Generate AGENTS.md with personality profiles
 */
function generateAgentsMd(agents) {
  const md = [];
  md.push('# Agent Personality Profiles');
  md.push('');
  md.push('This file defines the personality and behavior of each agent in your team.');
  md.push('');

  agents.forEach(agent => {
    md.push(`## ${agent.name}`);
    md.push('');
    md.push(`**Role:** ${agent.role}`);
    md.push('');
    md.push(`**Description:** ${agent.description}`);
    md.push('');
    md.push('**Personality:**');
    md.push(getDefaultPersonality(agent.id));
    md.push('');
    md.push('---');
    md.push('');
  });

  return md.join('\n');
}

/**
 * Get default personality for an agent
 */
function getDefaultPersonality(agentId) {
  const personalities = {
    coordinator: 'You are the Coordinator agent. Your role is to understand incoming requests and route them to the most appropriate specialist on the team. You are organized, decisive, and have a clear understanding of each team member\'s strengths.',
    researcher: 'You are the Researcher agent. You excel at deep research, synthesizing information from multiple sources, and creating comprehensive technical documents. You are thorough, analytical, and detail-oriented.',
    engineer: 'You are the Engineer agent. You specialize in building features, debugging code, and managing technical infrastructure. You write clean, maintainable code and follow best practices.',
    communicator: 'You are the Communicator agent. You handle social media, emails, messaging, and customer interactions. You are friendly, professional, and excellent at translating technical concepts for different audiences.',
    automator: 'You are the Automator agent. You create scheduled tasks, set up monitoring and alerts, and ensure systems run smoothly. You are proactive, reliable, and always thinking about efficiency.',
    strategist: 'You are the Strategist agent. You focus on long-term planning, strategic analysis, and making high-level decisions. You see the big picture and help align actions with goals.'
  };

  return personalities[agentId] || 'You are an AI agent ready to help with your assigned tasks.';
}

/**
 * Generate README for the configuration
 */
function generateReadme(agents, installPath) {
  const md = [];
  md.push('# ClawCrew Configuration');
  md.push('');
  md.push('This directory contains your ClawCrew multi-agent configuration.');
  md.push('');
  md.push('## Team Configuration');
  md.push('');
  md.push(`**Agents deployed:** ${agents.length}`);
  md.push('');
  agents.forEach(agent => {
    md.push(`- **${agent.name}** (${agent.role}): ${agent.description}`);
  });
  md.push('');
  md.push('## Files');
  md.push('');
  md.push('- `agents.yaml` - Agent configuration');
  md.push('- `models.yaml` - AI model configuration');
  md.push('- `AGENTS.md` - Agent personality profiles');
  md.push('- `.env` - API keys (keep this secret!)');
  md.push('');
  md.push('## Next Steps');
  md.push('');
  md.push('1. Review and customize agent personalities in `AGENTS.md`');
  md.push('2. Set up your communication channels');
  md.push('3. Start your Moltbot gateway');
  md.push('');
  md.push('## Security');
  md.push('');
  md.push('⚠️ **Important:** Never commit `.env` to version control!');
  md.push('');
  md.push('Add this to your `.gitignore`:');
  md.push('```');
  md.push('.env');
  md.push('```');

  return md.join('\n');
}

module.exports = {
  generateConfig
};
