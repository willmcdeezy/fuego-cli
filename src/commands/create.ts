import chalk from 'chalk';
import ora from 'ora';
import { FuegoWallet } from '../lib/wallet.js';
import { getWalletPath, getConfigPath, getFuegoCliVersion, setFuegoCliVersion } from '../lib/config.js';
import { showSuccess, showWarning, showInfo, formatPublicKey, flameDivider } from '../lib/ascii.js';
import fs from 'fs-extra';

interface CreateOptions {
  force?: boolean;
  directory?: string;
  name?: string;
}

export async function createCommand(options: CreateOptions): Promise<void> {
  console.log(); // spacer
  
  const spinner = ora({
    text: 'Checking for existing wallet...',
    color: 'yellow'
  }).start();
  
  try {
    const walletPath = options.directory 
      ? `${options.directory}/wallet.json` 
      : getWalletPath();
    
    const wallet = new FuegoWallet(walletPath);
    
    if (wallet.exists() && !options.force) {
      spinner.stop();
      showWarning('Wallet already exists.\n\nUse --force to overwrite.\n⚠️  Warning: Overwriting will destroy your current wallet!');
      return;
    }
    
    spinner.text = 'Generating new Solana keypair...';
    spinner.color = 'red';
    
    const { publicKey, mnemonic } = await wallet.create(options.name);
    
    // Create or update config.json
    const configPath = options.directory 
      ? `${options.directory}/config.json` 
      : getConfigPath();
    
    // Load existing config if it exists (from install command)
    let existingConfig: any = {};
    if (fs.existsSync(configPath)) {
      existingConfig = fs.readJsonSync(configPath);
    }
    
    // Merge with defaults, preserving fuego install info
    fs.writeJsonSync(configPath, {
      ...existingConfig,
      network: existingConfig.network || 'mainnet',
      rpcUrl: existingConfig.rpcUrl || 'https://api.mainnet-beta.solana.com'
    }, { spaces: 2 });
    
    // Store fuego-cli version
    setFuegoCliVersion(getFuegoCliVersion());
    
    spinner.stop();
    
    // Success display
    showSuccess(
      '🔥 Wallet Created Successfully!',
      `Name: ${chalk.cyan(options.name || 'default')}\nPublic Key: ${formatPublicKey(publicKey)}`
    );
    
    if (mnemonic) {
      showWarning(
        'IMPORTANT: Save this recovery phrase!\n' + 
        chalk.white(mnemonic) + 
        '\n\n' + chalk.red('Never share this phrase with anyone!')
      );
    }
    
    // File locations
    showInfo('📁 Wallet Files', [
      'Keypair: ~/.fuego/wallet.json',
      'Config: ~/.fuego/wallet-config.json'
    ]);
    
    flameDivider();
    
  } catch (error: any) {
    spinner.fail(chalk.red(`Failed to create wallet: ${error.message}`));
    process.exit(1);
  }
}
