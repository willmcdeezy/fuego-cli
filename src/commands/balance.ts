import chalk from 'chalk';
import ora from 'ora';
import { FuegoWallet } from '../lib/wallet.js';

interface BalanceOptions {
  json?: boolean;
}

export async function balanceCommand(options: BalanceOptions): Promise<void> {
  const spinner = ora('Fetching balance...').start();
  
  try {
    const wallet = new FuegoWallet();
    
    if (!wallet.exists()) {
      spinner.fail('No wallet found. Run "fuego init" first.');
      process.exit(1);
    }
    
    const balance = await wallet.getBalance();
    
    spinner.stop();
    
    if (options.json) {
      console.log(JSON.stringify(balance, null, 2));
    } else {
      console.log(chalk.cyan.bold('\n💰 Wallet Balance\n'));
      console.log(`${chalk.white('SOL:')}  ${chalk.yellow(balance.sol.toFixed(4))}`);
      
      if (balance.tokens.length > 0) {
        console.log(chalk.white('\nTokens:'));
        for (const token of balance.tokens) {
          console.log(`  ${chalk.cyan(token.symbol)}: ${chalk.yellow(token.amount)}`);
        }
      }
      
      console.log(chalk.gray(`\nAddress: ${wallet.getPublicKey()}`));
    }
    
  } catch (error) {
    spinner.fail(`Failed to fetch balance: ${error.message}`);
    process.exit(1);
  }
}
