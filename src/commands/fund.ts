import chalk from 'chalk';
import qrcode from 'qrcode-terminal';
import boxen from 'boxen';
import { loadWalletConfig } from '../lib/config.js';
import { showInfo, flameDivider } from '../lib/ascii.js';

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

  // Generate QR code first, then display everything in a box
  qrcode.generate(address, { small: true }, (qrcodeOutput: string) => {
    // Indent the QR code
    const indentedQr = qrcodeOutput.split('\n').map(line => '  ' + line).join('\n');
    
    // Build the fund box content
    const fundContent = [
      chalk.bold.cyan('💰 Fund Your Wallet'),
      '',
      chalk.white('Address:'),
      chalk.cyan(address),
      '',
      chalk.yellow('📱 Scan to send funds to your address:'),
      '',
      indentedQr
    ].join('\n');
    
    // Display the fund box
    console.log(
      boxen(fundContent, {
        padding: 1,
        margin: { top: 0, bottom: 1 },
        borderStyle: 'round',
        borderColor: 'green'
      })
    );
    
    // Show MoonPay box
    showInfo('🔗 MoonPay Onramp', [
      'Buy SOL with card/bank and send directly to your wallet:',
      '',
      chalk.cyan(moonpayUrl)
    ]);
    
    flameDivider();
  });
}
