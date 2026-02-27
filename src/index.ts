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
import { rpcCommand } from './commands/rpc.js';
import { contactsAddCommand, contactsListCommand, contactsShowCommand, contactsRemoveCommand } from './commands/contacts.js';
import { sendCommand } from './commands/send.js';
import { fundCommand } from './commands/fund.js';
import { purchCommand } from './commands/purch.js';
import { showBanner } from './lib/ascii.js';
import { getFuegoCliVersion } from './lib/config.js';

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
    .version(getFuegoCliVersion())
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

  program
    .command('rpc')
    .description('Show or configure your Solana RPC endpoint')
    .option('-u, --url <url>', 'RPC endpoint URL (e.g., https://api.mainnet-beta.solana.com)')
    .option('-n, --network <network>', 'Network type (mainnet, devnet, testnet)', 'mainnet')
    .action(rpcCommand);

  const contacts = program
    .command('contacts')
    .description('Manage your contacts (stored in ~/.fuego/contacts/address-book.json)');

  contacts
    .command('add <name> <address>')
    .description('Add a contact')
    .option('-l, --label <label>', 'Optional description/label for this contact')
    .action(contactsAddCommand);

  contacts
    .command('list')
    .description('List all contacts')
    .action(contactsListCommand);

  contacts
    .command('show <name>')
    .description('Show details for a specific contact')
    .action(contactsShowCommand);

  contacts
    .command('remove <name>')
    .description('Remove a contact')
    .option('-y, --yes', 'Skip confirmation prompt')
    .action(contactsRemoveCommand);

  program
    .command('fund')
    .description('Show funding options: MoonPay link + QR code for your wallet')
    .action(fundCommand);

  program
    .command('send <recipient> <amount>')
    .description('Send SOL, USDC, or USDT to an address or contact')
    .requiredOption('-t, --token <token>', 'Token to send (SOL, USDC, USDT)')
    .option('-y, --yes', 'Skip confirmation and send immediately')
    .action(sendCommand);

  program
    .command('purch <product-url>')
    .description('Purchase products via x402/Purch.xyz (Amazon, Shopify, etc.)')
    .requiredOption('--email <email>', 'Email for order notifications')
    .requiredOption('--name <name>', 'Full name for shipping')
    .requiredOption('--address-line1 <address>', 'Street address line 1')
    .option('--address-line2 <address>', 'Apartment, suite, etc. (optional)')
    .requiredOption('--city <city>', 'City')
    .requiredOption('--state <state>', 'State/Province code (e.g., TX)')
    .requiredOption('--postal-code <code>', 'Postal/ZIP code')
    .option('--country <code>', 'Country code (default: US)', 'US')
    .action(purchCommand);

  await program.parseAsync(process.argv);
}

main().catch((error) => {
  console.error(chalk.red(`\n❌ Error: ${error.message}`));
  process.exit(1);
});
