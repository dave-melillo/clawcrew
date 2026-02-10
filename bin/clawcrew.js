#!/usr/bin/env node

const { program } = require('commander');
const { runWizard } = require('../cli/wizard');
const pkg = require('../package.json');

program
  .name('clawcrew')
  .description('ClawCrew - Multi-agent Moltbot setup wizard')
  .version(pkg.version);

program
  .command('wizard')
  .description('Start the interactive setup wizard')
  .action(async () => {
    try {
      await runWizard();
    } catch (error) {
      console.error('Error running wizard:', error.message);
      process.exit(1);
    }
  });

// Default command
if (!process.argv.slice(2).length) {
  runWizard().catch((error) => {
    console.error('Error:', error.message);
    process.exit(1);
  });
} else {
  program.parse();
}
