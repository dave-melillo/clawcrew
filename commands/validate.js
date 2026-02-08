const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');

async function validateCommand(options) {
  const workspace = options.workspace;
  
  console.log(chalk.cyan.bold('\nClawCrew Configuration Validation'));
  console.log(chalk.cyan('==================================\n'));
  
  let allPassed = true;
  const results = [];
  
  // Check 1: Workspace files
  const spinner1 = ora('Checking workspace files...').start();
  const filesCheck = await validateWorkspaceFiles(workspace);
  
  if (filesCheck.passed) {
    spinner1.succeed(chalk.green('Workspace files'));
    for (const detail of filesCheck.details) {
      console.log(chalk.gray(`       ${detail}`));
    }
  } else {
    spinner1.fail(chalk.red('Workspace files'));
    for (const detail of filesCheck.details) {
      console.log(chalk.gray(`       ${detail}`));
    }
    allPassed = false;
  }
  results.push(filesCheck);
  
  // Check 2: File content validation
  const spinner2 = ora('Validating file content...').start();
  const contentCheck = await validateContent(workspace);
  
  if (contentCheck.passed) {
    spinner2.succeed(chalk.green('File content'));
    for (const detail of contentCheck.details) {
      console.log(chalk.gray(`       ${detail}`));
    }
  } else {
    spinner2.fail(chalk.red('File content'));
    for (const detail of contentCheck.details) {
      console.log(chalk.gray(`       ${detail}`));
    }
    allPassed = false;
  }
  results.push(contentCheck);
  
  // Check 3: Directory structure
  const spinner3 = ora('Checking directory structure...').start();
  const dirCheck = await validateDirectories(workspace);
  
  if (dirCheck.passed) {
    spinner3.succeed(chalk.green('Directory structure'));
    for (const detail of dirCheck.details) {
      console.log(chalk.gray(`       ${detail}`));
    }
  } else {
    spinner3.warn(chalk.yellow('Directory structure (optional)'));
    for (const detail of dirCheck.details) {
      console.log(chalk.gray(`       ${detail}`));
    }
  }
  results.push(dirCheck);
  
  // Summary
  console.log('\n' + chalk.cyan('============================='));
  
  if (allPassed) {
    console.log(chalk.green.bold('Status: READY'));
    console.log(chalk.gray('\nYour agent configuration is valid!'));
    console.log(chalk.gray('\nNext steps:'));
    console.log(chalk.gray('  1. Review and customize USER.md'));
    console.log(chalk.gray('  2. Start your agent crew'));
    console.log(chalk.gray('  3. Send a test message to your crew\n'));
  } else {
    console.log(chalk.red.bold('Status: ISSUES FOUND'));
    console.log(chalk.gray('\nPlease fix the issues above and run validate again.\n'));
    process.exit(1);
  }
}

async function validateWorkspaceFiles(workspace) {
  const requiredFiles = ['SOUL.md', 'USER.md', 'AGENTS.md'];
  const optionalFiles = ['MEMORY.md', 'HEARTBEAT.md', 'IDENTITY.md', 'TOOLS.md'];
  
  const details = [];
  let passed = true;
  
  for (const file of requiredFiles) {
    const filePath = path.join(workspace, file);
    if (await fs.pathExists(filePath)) {
      const stats = await fs.stat(filePath);
      details.push(`✓ ${file} (${stats.size} bytes)`);
    } else {
      details.push(`✗ ${file} missing`);
      passed = false;
    }
  }
  
  for (const file of optionalFiles) {
    const filePath = path.join(workspace, file);
    if (await fs.pathExists(filePath)) {
      const stats = await fs.stat(filePath);
      details.push(`✓ ${file} (${stats.size} bytes)`);
    }
  }
  
  return { passed, details };
}

async function validateContent(workspace) {
  const details = [];
  let passed = true;
  
  // Check SOUL.md has content
  const soulPath = path.join(workspace, 'SOUL.md');
  if (await fs.pathExists(soulPath)) {
    const soul = await fs.readFile(soulPath, 'utf-8');
    if (soul.length > 100) {
      details.push('✓ SOUL.md has personality definition');
    } else {
      details.push('⚠ SOUL.md seems incomplete');
      passed = false;
    }
  }
  
  // Check USER.md has been customized
  const userPath = path.join(workspace, 'USER.md');
  if (await fs.pathExists(userPath)) {
    const user = await fs.readFile(userPath, 'utf-8');
    
    // Check if placeholder text is still there
    if (user.includes('[Your name]') || user.includes('[Your timezone]')) {
      details.push('⚠ USER.md contains placeholder text');
      details.push('  Edit USER.md to add your information');
      passed = false;
    } else {
      details.push('✓ USER.md has been customized');
    }
  }
  
  return { passed, details };
}

async function validateDirectories(workspace) {
  const details = [];
  let passed = true;
  
  // Check for memory directory
  const memoryDir = path.join(workspace, 'memory');
  if (await fs.pathExists(memoryDir)) {
    details.push('✓ memory/ directory exists');
  } else {
    details.push('⚠ memory/ directory not found (will be created on first run)');
  }
  
  return { passed, details };
}

module.exports = validateCommand;
