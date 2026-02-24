import chalk from 'chalk';
import { loadWalletConfig } from '../lib/config.js';
import { showInfo, formatPublicKey, flameDivider } from '../lib/ascii.js';

export async function addressCommand(): Promise<void> {
  console.log(); // spacer
  
  const config = loadWalletConfig();
  
  if (!config) {
    console.log(chalk.red('❌ No wallet found. Run "fuego create" first.'));
    process.exit(1);
  }
  
  showInfo('📍 Your Fuego Address', [
    `Name: ${chalk.cyan(config.name || 'default')}`,
    `Public Key: ${formatPublicKey(config.publicKey)}`
  ]);
  
  // Also show plain for easy copying
  console.log(chalk.gray('\nPlain text (for copying):'));
  console.log(chalk.white(config.publicKey));
  
  flameDivider();
}
