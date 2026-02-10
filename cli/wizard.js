const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const { generateConfig } = require('./config-generator');
const { validateApiKey } = require('./validator');

const AGENT_TEMPLATES = [
  {
    id: 'coordinator',
    name: 'Coordinator',
    role: 'Main Coordinator',
    description: 'Routes tasks to specialists, manages workflow orchestration',
    required: true,
    model: 'claude-sonnet-4-5',
    badge: 'Required'
  },
  {
    id: 'researcher',
    name: 'Researcher',
    role: 'Research & Writing',
    description: 'Deep research, technical content, document generation',
    required: false,
    model: 'claude-sonnet-4-5',
    badge: 'Recommended'
  },
  {
    id: 'engineer',
    name: 'Engineer',
    role: 'Code & Engineering',
    description: 'Builds features, debugs code, manages infrastructure',
    required: false,
    model: 'claude-sonnet-4-5',
    badge: 'Recommended'
  },
  {
    id: 'communicator',
    name: 'Communicator',
    role: 'Communications',
    description: 'Social media, emails, messaging, customer interactions',
    required: false,
    model: 'claude-haiku-4-5',
    badge: 'Recommended'
  },
  {
    id: 'automator',
    name: 'Automator',
    role: 'Automation & Monitoring',
    description: 'Scheduled tasks, alerts, system health monitoring',
    required: false,
    model: 'claude-sonnet-4-5',
    badge: 'Advanced'
  },
  {
    id: 'strategist',
    name: 'Strategist',
    role: 'Strategy & Planning',
    description: 'Long-term planning, analysis, strategic decisions',
    required: false,
    model: 'claude-sonnet-4-5',
    badge: 'Advanced'
  }
];

const PRESETS = {
  recommended: ['coordinator', 'researcher', 'engineer', 'communicator'],
  minimal: ['coordinator'],
  full: ['coordinator', 'researcher', 'engineer', 'communicator', 'automator', 'strategist']
};

async function runWizard() {
  console.log(chalk.cyan.bold('\n╔════════════════════════════════════════╗'));
  console.log(chalk.cyan.bold('║   ClawCrew Setup Wizard                ║'));
  console.log(chalk.cyan.bold('╚════════════════════════════════════════╝\n'));
  console.log(chalk.gray('Set up your multi-agent Moltbot system in 5 minutes\n'));

  // Step 1: Welcome
  const { proceed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'proceed',
      message: 'Ready to build your AI agent team?',
      default: true
    }
  ]);

  if (!proceed) {
    console.log(chalk.yellow('\nSetup cancelled.'));
    return;
  }

  // Step 2: Choose team preset or custom
  console.log(chalk.cyan('\n── Step 1: Choose Your Team ──\n'));

  const { teamPreset } = await inquirer.prompt([
    {
      type: 'list',
      name: 'teamPreset',
      message: 'Select a team configuration:',
      choices: [
        { name: 'Recommended (Coordinator + Researcher + Engineer + Communicator)', value: 'recommended' },
        { name: 'Minimal (Coordinator only)', value: 'minimal' },
        { name: 'Full Team (All agents)', value: 'full' },
        { name: 'Custom (Choose specific agents)', value: 'custom' }
      ]
    }
  ]);

  let selectedAgents = [];

  if (teamPreset === 'custom') {
    const { agents } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'agents',
        message: 'Select agents to deploy:',
        choices: AGENT_TEMPLATES.map(agent => ({
          name: `${agent.name} - ${agent.description} [${agent.badge}]`,
          value: agent.id,
          checked: agent.required,
          disabled: agent.required ? '(Required)' : false
        })),
        validate: (answer) => {
          if (answer.length < 1) {
            return 'You must select at least the Coordinator agent.';
          }
          return true;
        }
      }
    ]);
    selectedAgents = agents;
  } else {
    selectedAgents = PRESETS[teamPreset];
  }

  const agentsList = selectedAgents.map(id =>
    AGENT_TEMPLATES.find(a => a.id === id).name
  ).join(', ');

  console.log(chalk.green(`\n✓ Selected agents: ${agentsList}\n`));

  // Step 3: Configure API Keys
  console.log(chalk.cyan('── Step 2: Configure API Keys ──\n'));

  const { anthropicKey } = await inquirer.prompt([
    {
      type: 'password',
      name: 'anthropicKey',
      message: 'Enter your Anthropic API key (starts with sk-ant-):',
      mask: '*',
      validate: (input) => {
        if (!input || input.length < 10) {
          return 'Please enter a valid API key';
        }
        if (!input.startsWith('sk-ant-')) {
          return 'Anthropic API keys should start with sk-ant-';
        }
        return true;
      }
    }
  ]);

  // Validate API key
  const spinner = ora('Validating API key...').start();
  const isValid = await validateApiKey(anthropicKey);

  if (!isValid) {
    spinner.fail('API key validation failed');
    console.log(chalk.yellow('\nPlease check your API key and try again.'));
    return;
  }

  spinner.succeed('API key validated');

  // Step 4: Installation path
  console.log(chalk.cyan('\n── Step 3: Installation Path ──\n'));

  const { installPath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'installPath',
      message: 'Where should ClawCrew config be saved?',
      default: '~/.clawcrew',
      validate: (input) => {
        if (!input || input.trim() === '') {
          return 'Please enter a valid path';
        }
        return true;
      }
    }
  ]);

  // Step 5: Generate configuration
  console.log(chalk.cyan('\n── Step 4: Generating Configuration ──\n'));

  const configSpinner = ora('Generating configuration files...').start();

  const config = {
    agents: selectedAgents.map(id => AGENT_TEMPLATES.find(a => a.id === id)),
    apiKey: anthropicKey,
    installPath: installPath
  };

  try {
    await generateConfig(config);
    configSpinner.succeed('Configuration files generated');
  } catch (error) {
    configSpinner.fail('Failed to generate configuration');
    throw error;
  }

  // Step 6: Success
  console.log(chalk.green.bold('\n╔════════════════════════════════════════╗'));
  console.log(chalk.green.bold('║   Your Team Is Ready! 🎉               ║'));
  console.log(chalk.green.bold('╚════════════════════════════════════════╝\n'));

  console.log(chalk.white('Configuration saved to:'), chalk.cyan(installPath));
  console.log(chalk.white('Agents deployed:'), chalk.cyan(selectedAgents.length));
  console.log(chalk.white('Team members:'), chalk.cyan(agentsList));

  console.log(chalk.gray('\n── Next Steps ──\n'));
  console.log('  1. Review your configuration files');
  console.log('  2. Connect your communication channels');
  console.log('  3. Start your Moltbot gateway');
  console.log(chalk.gray('\nFor help, visit: https://github.com/yourusername/clawcrew\n'));
}

module.exports = { runWizard };
