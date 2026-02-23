import chalk from 'chalk';
import ora from 'ora';
import { FuegoWallet } from '../lib/wallet.js';

interface HistoryOptions {
  limit?: string;
  json?: boolean;
}

export async function historyCommand(options: HistoryOptions): Promise<void> {
  const spinner = ora('Fetching transaction history...').start();
  
  try {
    const wallet = new FuegoWallet();
    
    if (!wallet.exists()) {
      spinner.fail('No wallet found. Run "fuego init" first.');
      process.exit(1);
    }
    
    const limit = parseInt(options.limit || '10', 10);
    const transactions = await wallet.getHistory(limit);
    
    spinner.stop();
    
    if (options.json) {
      console.log(JSON.stringify(transactions, null, 2));
    } else {
      console.log(chalk.cyan.bold(`\n📜 Recent Transactions (${transactions.length})\n`));
      
      if (transactions.length === 0) {
        console.log(chalk.gray('No transactions found.'));
      } else {
        for (const tx of transactions) {
          const direction = tx.type === 'incoming' ? chalk.green('↑') : chalk.red('↓');
          console.log(`${direction} ${chalk.white(tx.amount)} ${chalk.gray(tx.token)} - ${chalk.cyan(tx.signature.slice(0, 16))}...`);
        }
      }
    }
    
  } catch (error) {
    spinner.fail(`Failed to fetch history: ${error.message}`);
    process.exit(1);
  }
}
