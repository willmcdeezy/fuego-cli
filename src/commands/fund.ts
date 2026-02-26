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

  showSuccess('💰 Fund Your Wallet', 'Get SOL into your wallet');
  
  console.log(); // spacer
  
  // Show address first
  console.log(chalk.yellow('📍 Address:'));
  console.log(chalk.cyan(address));
  
  console.log(); // spacer
  
  // Generate QR code for the wallet address (indented)
  console.log(chalk.yellow('📱 Scan address:'));
  console.log();
  
  // Generate QR with indentation (4 spaces)
  qrcode.generate(address, { small: true }, (qrcodeOutput: string) => {
    const indented = qrcodeOutput.split('\n').map(line => '    ' + line).join('\n');
    console.log(indented);
  });
  
  console.log(); // spacer
  
  // Show MoonPay link (no QR code)
  showInfo('🔗 MoonPay Onramp', [
    'Buy SOL with card/bank and send directly to your wallet:',
    '',
    chalk.cyan(moonpayUrl)
  ]);
  
  flameDivider();
}
