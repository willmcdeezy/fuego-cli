#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createCommand } from './commands/create.js';
import { installCommand } from './commands/install.js';
import { addressCommand } from './commands/address.js';
import { balanceCommand } from './commands/balance.js';
import { serveCommand } from './commands/serve.js';
import { dashboardCommand } from './commands/dashboard.js';
import { updateCommand } from './commands/update.js';
import { showBanner } from './lib/ascii.js';

async function main() {
  // Show banner for help and when no args provided
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showBanner();
  }

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
    .option('-p, --path <path>', 'Installation path (default: ~/.openclaw/workspace/fuego if exists, else ./fuego)')
    .action(installCommand);

  program
    .command('address')
    .alias('addr')
    .description('Show your wallet address')
    .action(addressCommand);

  program
    .command('balance')
    .alias('bal')
    .description('Show your wallet balances (SOL, USDC, USDT)')
    .action(balanceCommand);

  program
    .command('serve')
    .description('Start the Fuego Rust server (runs cargo run in server directory)')
    .action(serveCommand);

  program
    .command('dashboard')
    .alias('dash')
    .description('Open the Fuego dashboard in your browser')
    .action(dashboardCommand);

  program
    .command('update')
    .description('Update fuego-cli and/or fuego to latest versions')
    .option('--cli', 'Update only fuego-cli')
    .option('--fuego', 'Update only the fuego project')
    .action(updateCommand);

  await program.parseAsync(process.argv);
}

main().catch((error) => {
  console.error(chalk.red(`\n❌ Error: ${error.message}`));
  process.exit(1);
});
