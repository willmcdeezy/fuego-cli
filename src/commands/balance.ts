import chalk from 'chalk';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { loadWalletConfig } from '../lib/config.js';
import { showInfo, formatPublicKey, flameDivider } from '../lib/ascii.js';
import ora from 'ora';

// Token mint addresses
const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
const USDT_MINT = new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenEqw');

export async function balanceCommand(): Promise<void> {
  console.log(); // spacer

  const config = loadWalletConfig();

  if (!config) {
    console.log(chalk.red('❌ No wallet found. Run "fuego create" first.'));
    process.exit(1);
  }

  const spinner = ora('Fetching balances...').start();

  try {
    const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    const publicKey = new PublicKey(config.publicKey);

    // Get SOL balance
    const solBalanceLamports = await connection.getBalance(publicKey);
    const solBalance = solBalanceLamports / LAMPORTS_PER_SOL;

    // Get USDC balance
    const usdcAta = await getAssociatedTokenAddress(USDC_MINT, publicKey);
    let usdcBalance = 0;
    try {
      const usdcAccount = await connection.getTokenAccountBalance(usdcAta);
      usdcBalance = usdcAccount.value.uiAmount || 0;
    } catch {
      // Account doesn't exist = 0 balance
      usdcBalance = 0;
    }

    // Get USDT balance
    const usdtAta = await getAssociatedTokenAddress(USDT_MINT, publicKey);
    let usdtBalance = 0;
    try {
      const usdtAccount = await connection.getTokenAccountBalance(usdtAta);
      usdtBalance = usdtAccount.value.uiAmount || 0;
    } catch {
      // Account doesn't exist = 0 balance
      usdtBalance = 0;
    }

    spinner.stop();

    showInfo('💰 Your Balances', [
      `Address: ${formatPublicKey(config.publicKey)}`,
      '',
      `${chalk.yellow('- SOL:')}     ${chalk.white(solBalance.toFixed(9))}`,
      `${chalk.green('- USDC:')}   ${chalk.white('$' + usdcBalance.toFixed(2))}`,
      `${chalk.cyan('- USDT:')}   ${chalk.white('$' + usdtBalance.toFixed(2))}`,
    ]);

    flameDivider();
  } catch (error) {
    spinner.stop();
    console.log(chalk.red(`\n❌ Failed to fetch balances: ${error instanceof Error ? error.message : 'Unknown error'}`));
    process.exit(1);
  }
}
