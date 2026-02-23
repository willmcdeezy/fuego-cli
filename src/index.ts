#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init.js';
import { balanceCommand } from './commands/balance.js';
import { sendCommand } from './commands/send.js';
import { receiveCommand } from './commands/receive.js';
import { historyCommand } from './commands/history.js';
import { configCommand } from './commands/config.js';

const program = new Command();

program
  .name('fuego')
  .description('🔥 Fuego CLI - Sovereign Solana wallet for AI agents')
  .version('0.1.0')
  .configureOutput({
    outputError: (str, write) => write(chalk.red(str))
  });

program
  .command('init')
  .description('Initialize a new Fuego wallet')
  .option('-f, --force', 'Overwrite existing wallet')
  .option('-d, --directory <path>', 'Custom config directory')
  .action(initCommand);

program
  .command('balance')
  .alias('bal')
  .description('Check wallet balance (SOL + tokens)')
  .option('--json', 'Output as JSON')
  .action(balanceCommand);

program
  .command('send')
  .description('Send SOL or SPL tokens')
  .requiredOption('-t, --to <address>', 'Recipient address')
  .requiredOption('-a, --amount <number>', 'Amount to send')
  .option('--token <mint>', 'Token mint (default: SOL)', 'SOL')
  .option('--network <url>', 'Custom RPC endpoint')
  .option('--json', 'Output as JSON')
  .action(sendCommand);

program
  .command('receive')
  .alias('recv')
  .description('Show receive address and QR code')
  .option('--qr', 'Display QR code in terminal', true)
  .action(receiveCommand);

program
  .command('history')
  .alias('tx')
  .description('View transaction history')
  .option('-l, --limit <n>', 'Number of transactions', '10')
  .option('--json', 'Output as JSON')
  .action(historyCommand);

program
  .command('config')
  .description('Manage Fuego configuration')
  .option('--get <key>', 'Get a config value')
  .option('--set <key=value>', 'Set a config value')
  .option('--list', 'List all config values')
  .action(configCommand);

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
