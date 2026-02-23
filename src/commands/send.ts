import chalk from 'chalk';
import ora from 'ora';
import { FuegoWallet } from '../lib/wallet.js';

interface SendOptions {
  to: string;
  amount: string;
  token?: string;
  network?: string;
  json?: boolean;
}

export async function sendCommand(options: SendOptions): Promise<void> {
  const spinner = ora('Preparing transaction...').start();
  
  try {
    const wallet = new FuegoWallet();
    
    if (!wallet.exists()) {
      spinner.fail('No wallet found. Run "fuego init" first.');
      process.exit(1);
    }
    
    // Validate amount
    const amount = parseFloat(options.amount);
    if (isNaN(amount) || amount <= 0) {
      spinner.fail('Invalid amount');
      process.exit(1);
    }
    
    spinner.text = 'Building transaction...';
    
    const result = await wallet.send({
      to: options.to,
      amount,
      token: options.token || 'SOL',
      network: options.network
    });
    
    spinner.succeed('Transaction sent!');
    
    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(chalk.green('\n✅ Transaction successful'));
      console.log(chalk.white(`\nAmount: ${chalk.yellow(options.amount)} ${options.token || 'SOL'}`);
      console.log(chalk.white(`To: ${chalk.cyan(options.to)}`));
      console.log(chalk.white(`Signature: ${chalk.cyan(result.signature)}`));
      console.log(chalk.gray(`\nView on Solscan: https://solscan.io/tx/${result.signature}`));
    }
    
  } catch (error) {
    spinner.fail(`Transaction failed: ${error.message}`);
    process.exit(1);
  }
}
