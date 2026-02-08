const chalk = require('chalk');
const inquirer = require('inquirer').default;
const ora = require('ora');
const { getPersonas, applyPersona } = require('../lib/templates');

async function templateCommand(name, options) {
  const workspace = options.workspace;
  
  // If --list flag, show available templates
  if (options.list) {
    await listTemplates();
    return;
  }
  
  // If no name provided, show interactive selection
  if (!name) {
    const personas = await getPersonas();
    
    const { selectedPersona } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedPersona',
        message: 'Choose a persona template:',
        choices: personas.map(p => ({
          name: `${p.name} - ${p.description}`,
          value: p.id
        }))
      }
    ]);
    
    name = selectedPersona;
  }
  
  // Confirm before applying
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Apply '${name}' template to ${workspace}?`,
      default: true
    }
  ]);
  
  if (!confirm) {
    console.log(chalk.yellow('Cancelled.'));
    return;
  }
  
  // Apply template
  const spinner = ora('Applying template...').start();
  
  try {
    const persona = await applyPersona(name, workspace);
    
    spinner.succeed(chalk.green(`Applied ${persona.name} template!`));
    
    console.log('\n' + chalk.cyan('Files created:'));
    console.log(chalk.gray('  • SOUL.md - Agent personality'));
    console.log(chalk.gray('  • USER.md - User profile'));
    
    console.log('\n' + chalk.yellow('Next steps:'));
    console.log(chalk.gray('  1. Edit USER.md with your information'));
    console.log(chalk.gray('  2. Customize SOUL.md if needed'));
    console.log(chalk.gray('  3. Run: clawcrew validate'));
    
  } catch (error) {
    spinner.fail(chalk.red('Failed to apply template'));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

async function listTemplates() {
  const personas = await getPersonas();
  
  console.log(chalk.cyan.bold('\nAvailable Persona Templates:\n'));
  
  for (const persona of personas) {
    console.log(chalk.bold(`  ${persona.name}`));
    console.log(chalk.gray(`    ${persona.description}`));
    console.log(chalk.dim(`    ID: ${persona.id}\n`));
  }
  
  console.log(chalk.gray('Usage: clawcrew template <id>'));
  console.log(chalk.gray('   or: clawcrew template (for interactive selection)\n'));
}

module.exports = templateCommand;
