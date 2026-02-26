import chalk from 'chalk';
import qrcode from 'qrcode-terminal';
import { loadWalletConfig } from '../lib/config.js';
import { showInfo, showSuccess, flameDivider } from '../lib/ascii.js';

export async function fundCommand(): Promise<void> {
  console.log(); // spacer

  const config = loadWalletConfig();

  if (!config) {
    console.log(chalk.red('❌ No wallet found. Run "fuego create" first.'));
    process.exit(1);
  }

  const address = config.publicKey;
  
  // MoonPay URL for funding SOL to this wallet
  const moonpayUrl = `https://buy.moonpay.com/?currencyCode=SOL&walletAddress=${address}`;

  showSuccess('💰 Fund Your Wallet', `Address: ${chalk.cyan(address)}`);
  
  console.log(); // spacer
  
  // Generate QR code for the wallet address
  console.log(chalk.yellow('📱 Scan to receive SOL:'));
  console.log();
  qrcode.generate(address, { small: true });
  
  console.log(); // spacer
  
  // Show MoonPay link
  showInfo('🔗 MoonPay Onramp', [
    'Buy SOL with card/bank and send directly to your wallet:',
    '',
    chalk.cyan(moonpayUrl),
    '',
    chalk.gray('Or scan this QR code to fund:')
  ]);
  
  console.log();
  qrcode.generate(moonpayUrl, { small: true });
  
  console.log(); // spacer
  
  // Copy-paste friendly
  console.log(chalk.gray('Your address (for copying):'));
  console.log(chalk.white(address));
  
  flameDivider();
}
