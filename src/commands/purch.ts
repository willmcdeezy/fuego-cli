import chalk from 'chalk';
import { spawn } from 'child_process';
import path from 'path';
import { loadWalletConfig, findFuegoPath } from '../lib/config.js';
import { showSuccess, showInfo, showError, flameDivider } from '../lib/ascii.js';

interface PurchOptions {
  email: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

export async function purchCommand(productUrl: string, options: PurchOptions): Promise<void> {
  console.log();

  // Validate required options
  if (!options.email || !options.name || !options.addressLine1 || !options.city || !options.state || !options.postalCode) {
    console.log(chalk.red('❌ Missing required options.'));
    console.log(chalk.gray('\nUsage:'));
    console.log(chalk.gray('  fuego purch <product-url>'));
    console.log(chalk.gray('    --email <email>'));
    console.log(chalk.gray('    --name <full-name>'));
    console.log(chalk.gray('    --address-line1 <street-address>'));
    console.log(chalk.gray('    --address-line2 <apartment/suite>'));
    console.log(chalk.gray('    --city <city>'));
    console.log(chalk.gray('    --state <state-code>'));
    console.log(chalk.gray('    --postal-code <zip>'));
    console.log(chalk.gray('    --country <country-code>'));
    console.log(chalk.gray('\nExample:'));
    console.log(chalk.gray('  fuego purch https://amazon.com/dp/B071G6PFDR \\\'));
    console.log(chalk.gray('    --email user@example.com \\\'));
    console.log(chalk.gray('    --name "John Doe" \\\'));
    console.log(chalk.gray('    --address-line1 "123 Main St" \\\'));
    console.log(chalk.gray('    --address-line2 "Apt 4B" \\\'));
    console.log(chalk.gray('    --city "Austin" \\\'));
    console.log(chalk.gray('    --state TX \\\'));
    console.log(chalk.gray('    --postal-code 78701 \\\'));
    console.log(chalk.gray('    --country US'));
    process.exit(1);
  }

  // Load wallet
  const walletConfig = loadWalletConfig();
  if (!walletConfig) {
    console.log(chalk.red('❌ No wallet found. Run "fuego create" first.'));
    process.exit(1);
  }

  // Show order preview
  showInfo('🛒 x402 Purchase Preview', [
    `Product: ${chalk.cyan(productUrl)}`,
    `Email: ${chalk.cyan(options.email)}`,
    `Name: ${chalk.cyan(options.name)}`,
    `Address: ${chalk.cyan(options.addressLine1)}${options.addressLine2 ? ', ' + options.addressLine2 : ''}`,
    `City: ${chalk.cyan(options.city)}, ${chalk.cyan(options.state)} ${chalk.cyan(options.postalCode)}`,
    `Country: ${chalk.cyan(options.country || 'US')}`,
    `Wallet: ${chalk.gray(walletConfig.publicKey)}`,
    `Network: ${chalk.gray('mainnet-beta')}`
  ]);

  console.log();
  console.log(chalk.blue('⏳ Processing x402 payment via Purch.xyz...'));

  // Find fuego installation path and call Node.js script
  const fuegoPath = findFuegoPath();
  if (!fuegoPath) {
    showError('Fuego installation not found. Run "fuego install" first.');
    process.exit(1);
  }
  
  const scriptPath = path.join(fuegoPath, 'scripts', 'x402_purch.mjs');
  
  const args = [
    scriptPath,
    '--product-url', productUrl,
    '--email', options.email,
    '--name', options.name,
    '--address-line1', options.addressLine1,
    '--city', options.city,
    '--state', options.state,
    '--postal-code', options.postalCode,
    '--country', options.country || 'US'
  ];

  if (options.addressLine2) {
    args.push('--address-line2', options.addressLine2);
  }

  const nodeProcess = spawn('node', args);

  let output = '';
  let errorOutput = '';

  nodeProcess.stdout.on('data', (data) => {
    output += data.toString();
    process.stdout.write(data);
  });

  nodeProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  nodeProcess.on('close', (code) => {
    if (code === 0) {
      // Check if payment was successful
      if (output.includes('PAYMENT ACCEPTED') || output.includes('SUCCESS')) {
        showSuccess('✅ x402 Payment Complete!', 'Order transaction received from Purch.xyz');
      } else if (output.includes('failed') || output.includes('❌')) {
        showError('Payment was not accepted. Check output above for details.');
        process.exit(1);
      } else {
        showSuccess('✅ x402 Purchase Flow Complete', '');
      }
      flameDivider();
    } else {
      showError(`x402 purchase failed: ${errorOutput || 'Unknown error'}`);
      process.exit(1);
    }
  });
}
