#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createCommand } from './commands/create.js';
import { installCommand } from './commands/install.js';

const program = new Command();

program
  .name('fuego')
  .description('🔥 Fuego CLI - Sovereign Solana wallet for AI agents')
  .version('0.1.0')
  .configureOutput({
    outputError: (str, write) => write(chalk.red(str))
  });

program
  .command('create')
  .description('Create a new Fuego wallet')
  .option('-f, --force', 'Overwrite existing wallet')
  .option('-d, --directory <path>', 'Custom config directory')
  .option('-n, --name <name>', 'Wallet name', 'default')
  .action(createCommand);

program
  .command('install')
  .description('Install the main Fuego project (for agents)')
  .option('-p, --path <path>', 'Installation path (default: ~/.openclaw/workspace/fuego)')
  .action(installCommand);

// Global error handler
program.exitOverride();

try {
  await program.parseAsync(process.argv);
} catch (error) {
  if (error.code !== 'commander.helpDisplayed' && error.code !== 'commander.versionDisplayed') {
    console.error(chalk.red(`\n❌ Error: ${error.message}`));
    process.exit(1);
  }
}
