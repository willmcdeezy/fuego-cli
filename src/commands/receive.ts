import chalk from 'chalk';
import { FuegoWallet } from '../lib/wallet.js';

interface ReceiveOptions {
  qr?: boolean;
}

export async function receiveCommand(options: ReceiveOptions): Promise<void> {
  try {
    const wallet = new FuegoWallet();
    
    if (!wallet.exists()) {
      console.log(chalk.red('No wallet found. Run "fuego init" first.'));
      process.exit(1);
    }
    
    const publicKey = wallet.getPublicKey();
    
    console.log(chalk.cyan.bold('\n📥 Receive Funds\n'));
    console.log(chalk.white('Your Fuego address:'));
    console.log(chalk.cyan.bold(publicKey));
    
    if (options.qr) {
      console.log(chalk.gray('\nQR Code:'));
      // TODO: Generate QR code in terminal
      console.log(chalk.yellow('[QR generation coming in v0.2]'));
    }
    
    console.log(chalk.gray('\nShare this address to receive SOL or SPL tokens.'));
    
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}
