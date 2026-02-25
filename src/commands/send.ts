import chalk from 'chalk';
import { spawn } from 'child_process';
import path from 'path';
import os from 'os';
import { loadWalletConfig } from '../lib/config.js';
import { showSuccess, showInfo, showError, formatPublicKey, flameDivider } from '../lib/ascii.js';
import fs from 'fs-extra';

const ADDRESS_BOOK_FILE = path.join(os.homedir(), '.fuego', 'contacts', 'address-book.json');

interface SendOptions {
  token?: string;
  yes?: boolean;
}

interface AddressBook {
  [name: string]: {
    address: string;
    label?: string;
    addedAt: string;
  };
}

function loadAddressBook(): AddressBook {
  if (!fs.existsSync(ADDRESS_BOOK_FILE)) {
    return {};
  }
  return fs.readJsonSync(ADDRESS_BOOK_FILE);
}

function resolveRecipient(recipient: string): string {
  // Check if it's a direct address (32-44 chars, base58)
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(recipient)) {
    return recipient;
  }

  // Check address book
  const book = loadAddressBook();
  if (book[recipient]) {
    return book[recipient].address;
  }

  // Not found
  return '';
}

export async function sendCommand(recipient: string, amount: string, options: SendOptions): Promise<void> {
  console.log();

  // Validate inputs
  if (!recipient || !amount) {
    console.log(chalk.red('❌ Usage: fuego send <recipient> <amount> --token SOL|USDC|USDT [--yes]'));
    console.log(chalk.gray('\nExamples:'));
    console.log(chalk.gray('  fuego send GvCo... 0.5 --token SOL'));
    console.log(chalk.gray('  fuego send melanie 10 --token USDC'));
    console.log(chalk.gray('  fuego send melanie 5 --token USDT --yes'));
    console.log(chalk.gray('\nRecipient can be an address or address book contact name.'));
    process.exit(1);
  }

  // Load wallet
  const walletConfig = loadWalletConfig();
  if (!walletConfig) {
    console.log(chalk.red('❌ No wallet found. Run "fuego create" first.'));
    process.exit(1);
  }

  // Resolve recipient
  const resolvedAddress = resolveRecipient(recipient);
  if (!resolvedAddress) {
    console.log(chalk.red(`❌ Recipient "${recipient}" not found.`));
    console.log(chalk.gray('\nCheck your address book: fuego addbook list'));
    console.log(chalk.gray('Or use a full Solana address.'));
    process.exit(1);
  }

  // Validate amount
  const amountNum = parseFloat(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    console.log(chalk.red('❌ Invalid amount. Please provide a positive number.'));
    process.exit(1);
  }

  // Determine token
  const token = (options.token || '').toUpperCase();
  if (!token) {
    console.log(chalk.red('❌ Token is required. Use: --token SOL, --token USDC, or --token USDT'));
    process.exit(1);
  }
  if (!['SOL', 'USDC', 'USDT'].includes(token)) {
    console.log(chalk.red('❌ Invalid token. Use: SOL, USDC, or USDT'));
    process.exit(1);
  }

  // Show transaction details
  const isContact = recipient !== resolvedAddress;
  showInfo('📝 Transaction Preview', [
    `From: ${chalk.cyan(formatPublicKey(walletConfig.publicKey))}`,
    `To: ${chalk.cyan(formatPublicKey(resolvedAddress))}${isContact ? chalk.gray(` (${recipient})`) : ''}`,
    `Amount: ${chalk.yellow(amount)} ${chalk.cyan(token)}`,
    `Network: ${chalk.gray('mainnet-beta')}`
  ]);

  // Confirm unless --yes
  if (!options.yes) {
    console.log();
    console.log(chalk.yellow('⚠️  Add --yes to confirm and send'));
    flameDivider();
    return;
  }

  console.log();
  console.log(chalk.blue('⏳ Executing transaction via Fuego...'));

  // Call Python script directly - it handles build + sign + submit
  const scriptPath = path.join(os.homedir(), '.openclaw', 'workspace', 'fuego', 'scripts', 'sign_and_submit.py');
  
  const pythonProcess = spawn('python3', [
    scriptPath,
    '--from', walletConfig.publicKey,
    '--to', resolvedAddress,
    '--amount', amount,
    '--token', token
  ]);

  let output = '';
  let errorOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
    process.stdout.write(data);
  });

  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      // Extract signature from output if present
      const sigMatch = output.match(/Signature: ([A-Za-z0-9]+)/);
      if (sigMatch) {
        showSuccess(
          '✅ Transaction Sent!',
          `Amount: ${chalk.yellow(amount)} ${chalk.cyan(token)}\nTo: ${chalk.cyan(isContact ? recipient : formatPublicKey(resolvedAddress))}`
        );
      } else {
        showSuccess('✅ Transaction Complete!', '');
      }
      flameDivider();
    } else {
      showError(`Transaction failed: ${errorOutput || 'Unknown error'}`);
      process.exit(1);
    }
  });
}
