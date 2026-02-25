import chalk from 'chalk';
import { setConfig, getConfig, listConfig } from '../lib/config.js';
import { showSuccess, showInfo, flameDivider } from '../lib/ascii.js';

interface AddRpcOptions {
  url?: string;
  network?: string;
}

export async function addRpcCommand(options: AddRpcOptions): Promise<void> {
  console.log(); // spacer

  // If no URL provided, show current config and help
  if (!options.url) {
    const currentRpc = getConfig('rpcUrl');
    const currentNetwork = getConfig('network');
    
    showInfo('⚙️  Current RPC Configuration', [
      `RPC URL: ${currentRpc ? chalk.cyan(currentRpc) : chalk.gray('Not set')}`,
      `Network: ${currentNetwork ? chalk.cyan(currentNetwork) : chalk.gray('mainnet')}`,
      '',
      `${chalk.yellow('Usage:')} fuego addrpc --url https://api.mainnet-beta.solana.com`,
      `${chalk.yellow('Or:')}     fuego addrpc --url https://helius.xyz/... --network mainnet`
    ]);
    
    flameDivider();
    return;
  }

  // Validate URL
  try {
    new URL(options.url);
  } catch {
    console.log(chalk.red('❌ Invalid URL. Please provide a valid RPC endpoint.'));
    process.exit(1);
  }

  // Set the RPC URL
  setConfig('rpcUrl', options.url);
  
  // Set network if provided, default to mainnet
  const network = options.network || 'mainnet';
  setConfig('network', network);

  showSuccess(
    '✅ RPC Configuration Updated',
    `URL: ${chalk.cyan(options.url)}\nNetwork: ${chalk.cyan(network)}`
  );

  showInfo('💡 Tips', [
    'Premium RPCs (Helius, QuickNode) offer better performance',
    'Free public RPCs may have rate limits',
    'Your wallet address remains the same across networks'
  ]);

  flameDivider();
}
