import chalk from 'chalk';
import { loadWalletConfig } from '../lib/config.js';
import { showInfo, formatPublicKey, flameDivider } from '../lib/ascii.js';
import ora from 'ora';

const FUEGO_SERVER_URL = 'http://127.0.0.1:8080';

export async function balanceCommand(): Promise<void> {
  console.log(); // spacer

  const config = loadWalletConfig();

  if (!config) {
    console.log(chalk.red('❌ No wallet found. Run "fuego create" first.'));
    process.exit(1);
  }

  const spinner = ora('Fetching balances from Fuego server...').start();

  try {
    const publicKey = config.publicKey;
    const network = 'mainnet-beta';

    // Query SOL balance
    const solResponse = await fetch(`${FUEGO_SERVER_URL}/balance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ network, address: publicKey })
    });
    const solData = await solResponse.json();
    const solBalance = solData.success ? solData.data.sol : 0;

    // Query USDC balance
    const usdcResponse = await fetch(`${FUEGO_SERVER_URL}/usdc-balance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ network, address: publicKey })
    });
    const usdcData = await usdcResponse.json();
    const usdcBalance = usdcData.success ? parseFloat(usdcData.data.ui_amount) : 0;

    // Query USDT balance
    const usdtResponse = await fetch(`${FUEGO_SERVER_URL}/usdt-balance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ network, address: publicKey })
    });
    const usdtData = await usdtResponse.json();
    const usdtBalance = usdtData.success ? parseFloat(usdtData.data.ui_amount) : 0;

    spinner.stop();

    showInfo('💰 Your Balances', [
      `Address: ${formatPublicKey(publicKey)}`,
      '',
      `${chalk.yellow('- SOL:')}     ${chalk.white(solBalance.toFixed(9))}`,
      `${chalk.green('- USDC:')}   ${chalk.white('$' + usdcBalance.toFixed(2))}`,
      `${chalk.cyan('- USDT:')}   ${chalk.white('$' + usdtBalance.toFixed(2))}`,
    ]);

    flameDivider();
  } catch (error) {
    spinner.stop();
    console.log(chalk.red(`\n❌ Failed to fetch balances: ${error instanceof Error ? error.message : 'Unknown error'}`));
    console.log(chalk.gray('\nMake sure the Fuego server is running: cd fuego/server && cargo run'));
    process.exit(1);
  }
}
