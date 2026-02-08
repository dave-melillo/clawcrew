const chalk = require('chalk');
const inquirer = require('inquirer').default;
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const { loadState, saveState, clearState } = require('../lib/state');
const { getPersonas, applyPersona, applyBaseTemplates, applyCustomizations } = require('../lib/templates');

async function initCommand(options) {
  const workspace = options.workspace;
  
  console.log(chalk.cyan.bold('\n🐺 ClawCrew Agent Setup\n'));
  console.log(chalk.gray('This wizard will guide you through setting up your personal AI assistant.\n'));
  
  // Check for existing state
  let state = null;
  if (options.resume) {
    state = await loadState(workspace);
    if (state) {
      console.log(chalk.yellow('Resuming from previous session...\n'));
    }
  }
  
  if (!state) {
    state = {
      step: 0,
      userProfile: {},
      agentConfig: {},
      integrations: []
    };
  }
  
  try {
    // Step 1: User Profile
    if (state.step < 1) {
      console.log(chalk.cyan.bold('Step 1: User Profile\n'));
      state.userProfile = await collectUserProfile(state.userProfile);
      state.step = 1;
      await saveState(workspace, state);
    }
    
    // Step 2: Persona Selection
    if (state.step < 2) {
      console.log(chalk.cyan.bold('\nStep 2: Persona Selection\n'));
      state.agentConfig = await selectPersona(state.agentConfig);
      state.step = 2;
      await saveState(workspace, state);
    }
    
    // Step 3: Agent Customization
    if (state.step < 3) {
      console.log(chalk.cyan.bold('\nStep 3: Agent Customization\n'));
      state.agentConfig = await customizeAgent(state.agentConfig, state.userProfile);
      state.step = 3;
      await saveState(workspace, state);
    }
    
    // Step 4: Review & Generate
    if (state.step < 4) {
      console.log(chalk.cyan.bold('\nStep 4: Review & Generate\n'));
      await reviewAndGenerate(workspace, state);
      state.step = 4;
    }
    
    // Clear state on successful completion
    await clearState(workspace);
    
    console.log(chalk.green.bold('\n✓ Setup complete!\n'));
    console.log(chalk.cyan('Your agent is ready to use.\n'));
    
    console.log(chalk.yellow('Next steps:'));
    console.log(chalk.gray('  1. Review the generated files in ' + workspace));
    console.log(chalk.gray('  2. Run: clawcrew validate'));
    console.log(chalk.gray('  3. Start Moltbot in this workspace'));
    console.log(chalk.gray('  4. Send a test message to your agent\n'));
    
  } catch (error) {
    if (error.message === 'USER_CANCELLED') {
      console.log(chalk.yellow('\nSetup cancelled. Run with --resume to continue later.\n'));
      process.exit(0);
    }
    throw error;
  }
}

async function collectUserProfile(existing = {}) {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'What\'s your first name?',
      default: existing.firstName,
      validate: (input) => input.length > 0 ? true : 'Please enter your name'
    },
    {
      type: 'input',
      name: 'preferredName',
      message: 'What should the agent call you? (leave blank for first name)',
      default: existing.preferredName
    },
    {
      type: 'list',
      name: 'timezone',
      message: 'What\'s your timezone?',
      default: existing.timezone || 'America/New_York',
      choices: [
        'America/New_York',
        'America/Chicago',
        'America/Denver',
        'America/Los_Angeles',
        'America/Phoenix',
        'Europe/London',
        'Europe/Paris',
        'Asia/Tokyo',
        'Australia/Sydney',
        { name: 'Other (manual entry)', value: 'custom' }
      ]
    },
    {
      type: 'input',
      name: 'customTimezone',
      message: 'Enter your timezone (e.g., America/Toronto):',
      when: (answers) => answers.timezone === 'custom',
      validate: (input) => input.length > 0 ? true : 'Please enter a timezone'
    },
    {
      type: 'list',
      name: 'communicationStyle',
      message: 'How should the agent communicate?',
      default: existing.communicationStyle || 'adaptive',
      choices: [
        { name: 'Casual and friendly', value: 'casual' },
        { name: 'Professional and formal', value: 'professional' },
        { name: 'Adaptive (matches your tone)', value: 'adaptive' }
      ]
    },
    {
      type: 'list',
      name: 'lengthPreference',
      message: 'Response length preference?',
      default: existing.lengthPreference || 'adaptive',
      choices: [
        { name: 'Brief (quick answers)', value: 'brief' },
        { name: 'Detailed (thorough explanations)', value: 'detailed' },
        { name: 'Adaptive (context-dependent)', value: 'adaptive' }
      ]
    }
  ]);
  
  // Use custom timezone if selected
  if (answers.customTimezone) {
    answers.timezone = answers.customTimezone;
  }
  
  // Use firstName as preferred name if not specified
  if (!answers.preferredName) {
    answers.preferredName = answers.firstName;
  }
  
  return answers;
}

async function selectPersona(existing = {}) {
  const personas = await getPersonas();
  
  console.log(chalk.gray('Choose a persona that best matches your needs:\n'));
  
  const { personaId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'personaId',
      message: 'Select a persona:',
      default: existing.personaId,
      choices: personas.map(p => ({
        name: `${p.name} - ${p.description}`,
        value: p.id
      }))
    }
  ]);
  
  const selectedPersona = personas.find(p => p.id === personaId);
  
  // Show preview
  console.log(chalk.gray('\n' + selectedPersona.description + '\n'));
  
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Use this persona?',
      default: true
    }
  ]);
  
  if (!confirm) {
    return selectPersona(existing);
  }
  
  return { personaId, personaName: selectedPersona.name };
}

async function customizeAgent(existing = {}, userProfile = {}) {
  console.log(chalk.gray('Give your agent a personality:\n'));
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'agentName',
      message: 'What do you want to name your agent?',
      default: existing.agentName || 'Assistant',
      validate: (input) => input.length > 0 ? true : 'Please enter a name'
    },
    {
      type: 'confirm',
      name: 'enableEmoji',
      message: 'Enable emoji in responses?',
      default: existing.enableEmoji !== undefined ? existing.enableEmoji : true
    }
  ]);
  
  return { ...existing, ...answers };
}

async function reviewAndGenerate(workspace, state) {
  // Show summary
  console.log(chalk.cyan('Configuration Summary:\n'));
  console.log(chalk.gray(`  User: ${state.userProfile.preferredName}`));
  console.log(chalk.gray(`  Timezone: ${state.userProfile.timezone}`));
  console.log(chalk.gray(`  Persona: ${state.agentConfig.personaName}`));
  console.log(chalk.gray(`  Agent Name: ${state.agentConfig.agentName}`));
  console.log(chalk.gray(`  Communication: ${state.userProfile.communicationStyle}`));
  
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: '\nProceed with generation?',
      default: true
    }
  ]);
  
  if (!confirm) {
    throw new Error('USER_CANCELLED');
  }
  
  // Generate files
  const spinner = ora('Generating configuration files...').start();
  
  try {
    // Ensure workspace exists
    await fs.ensureDir(workspace);
    
    // Create memory directory
    await fs.ensureDir(path.join(workspace, 'memory'));
    
    // Apply base templates
    await applyBaseTemplates(workspace);
    
    // Apply persona with customizations
    const customizations = {
      agentName: state.agentConfig.agentName,
      userName: state.userProfile.preferredName,
      firstName: state.userProfile.firstName,
      preferredName: state.userProfile.preferredName,
      timezone: state.userProfile.timezone,
      userContext: `Communication style: ${state.userProfile.communicationStyle}. Response length: ${state.userProfile.lengthPreference}.`
    };
    
    await applyPersona(state.agentConfig.personaId, workspace, customizations);
    
    // Create IDENTITY.md
    const identity = `# Agent Identity

**Name:** ${state.agentConfig.agentName}
**Role:** Personal AI Assistant
**Persona:** ${state.agentConfig.personaName}
**User:** ${state.userProfile.preferredName}

---

*This agent assists ${state.userProfile.preferredName} with daily tasks and organization.*
`;
    
    await fs.writeFile(path.join(workspace, 'IDENTITY.md'), identity);
    
    // Create initial TOOLS.md
    const tools = `# TOOLS.md - Local Notes

This is your personal reference for environment-specific setup.

## Timezone
- Primary: ${state.userProfile.timezone}

## Communication Preferences
- Style: ${state.userProfile.communicationStyle}
- Length: ${state.userProfile.lengthPreference}
- Emoji: ${state.agentConfig.enableEmoji ? 'Yes' : 'No'}

## Notes
Add any tool-specific configuration here (camera names, SSH hosts, etc.)
`;
    
    await fs.writeFile(path.join(workspace, 'TOOLS.md'), tools);
    
    spinner.succeed(chalk.green('Configuration files generated'));
    
    // Show what was created
    console.log(chalk.cyan('\nFiles created:'));
    console.log(chalk.gray('  • SOUL.md - Agent personality'));
    console.log(chalk.gray('  • USER.md - User profile'));
    console.log(chalk.gray('  • AGENTS.md - Behavior rules'));
    console.log(chalk.gray('  • IDENTITY.md - Agent identity'));
    console.log(chalk.gray('  • MEMORY.md - Long-term memory'));
    console.log(chalk.gray('  • HEARTBEAT.md - Periodic tasks'));
    console.log(chalk.gray('  • TOOLS.md - Environment notes'));
    console.log(chalk.gray('  • memory/ - Daily logs directory'));
    
  } catch (error) {
    spinner.fail(chalk.red('Failed to generate configuration'));
    throw error;
  }
}

module.exports = initCommand;
