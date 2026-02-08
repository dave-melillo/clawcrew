#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const packageJson = require('../package.json');

// Import commands
const initCommand = require('../commands/init');
const validateCommand = require('../commands/validate');
const templateCommand = require('../commands/template');

program
  .name('clawcrew')
  .description('ClawCrew - Build your AI agent team')
  .version(packageJson.version);

// Init command - Interactive setup wizard
program
  .command('init')
  .description('Interactive setup wizard for new agent configuration')
  .option('-w, --workspace <path>', 'Workspace directory', process.cwd())
  .option('--resume', 'Resume from previous session')
  .action(initCommand);

// Validate command - Run validation checks
program
  .command('validate')
  .description('Validate agent configuration and integrations')
  .option('-w, --workspace <path>', 'Workspace directory', process.cwd())
  .action(validateCommand);

// Template command - Apply persona template
program
  .command('template [name]')
  .description('Apply a persona template to your agent')
  .option('-w, --workspace <path>', 'Workspace directory', process.cwd())
  .option('-l, --list', 'List available templates')
  .action(templateCommand);

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  console.log(chalk.cyan.bold('\n🐺 ClawCrew - Build Your AI Agent Team\n'));
  program.outputHelp();
  console.log('\n' + chalk.gray('Examples:'));
  console.log(chalk.gray('  $ clawcrew init              # Start interactive setup'));
  console.log(chalk.gray('  $ clawcrew template --list   # List available personas'));
  console.log(chalk.gray('  $ clawcrew validate          # Check configuration\n'));
}
