import chalk from 'chalk';
import ora from 'ora';
import { FuegoWallet } from '../lib/wallet.js';
import { getWalletPath } from '../lib/config.js';

interface InitOptions {
  force?: boolean;
  directory?: string;
}

export async function initCommand(options: InitOptions): Promise<void> {
  console.log(chalk.cyan.bold('\n🔥 Fuego Wallet Initialization\n'));
  
  const spinner = ora('Checking for existing wallet...').start();
  
  try {
    const walletPath = options.directory 
      ? `${options.directory}/wallet.json` 
      : getWalletPath();
    
    const wallet = new FuegoWallet(walletPath);
    
    if (wallet.exists() && !options.force) {
      spinner.fail('Wallet already exists. Use --force to overwrite.');
      console.log(chalk.yellow('⚠️  Warning: Overwriting will destroy your current wallet!'));
      return;
    }
    
    spinner.text = 'Generating new Solana keypair...';
    
    const { publicKey, mnemonic } = await wallet.create();
    
    spinner.succeed('Wallet created successfully!');
    
    console.log(chalk.green('\n✅ Your Fuego wallet is ready'));
    console.log(chalk.white('\n📍 Public Key:'));
    console.log(chalk.cyan.bold(publicKey));
    
    if (mnemonic) {
      console.log(chalk.yellow('\n⚠️  IMPORTANT: Save this recovery phrase:'));
      console.log(chalk.white(mnemonic));
      console.log(chalk.red('\nNever share this phrase with anyone!'));
    }
    
    console.log(chalk.gray(`\n💾 Keypair: ~/.fuego/wallet.json`));
    console.log(chalk.gray(`📋 Config: ~/.fuego/wallet-config.json`));
    
  } catch (error) {
    spinner.fail(`Failed to create wallet: ${error.message}`);
    process.exit(1);
  }
}
