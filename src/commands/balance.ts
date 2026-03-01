import chalk from 'chalk';
import { loadWalletConfig } from '../lib/config.js';
import { showInfo, formatPublicKey, flameDivider } from '../lib/ascii.js';
import ora from 'ora';

const FUEGO_SERVER_URL = 'http://127.0.0.1:8080';

interface Token {
  symbol: string;
  ui_amount: number;
  decimals: number;
  mint: string;
  token_account: string;
  amount: string;
}

interface TokensResponse {
  success: boolean;
  data?: {
    wallet: string;
    network: string;
    sol_balance: number;
    sol_lamports: number;
    token_count: number;
    tokens: Token[];
  };
}

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

    // Query all tokens via /tokens endpoint
    const tokensResponse = await fetch(`${FUEGO_SERVER_URL}/tokens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ network, address: publicKey })
    });
    const tokensData = await tokensResponse.json() as TokensResponse;

    spinner.stop();

    if (!tokensData.success || !tokensData.data) {
      console.log(chalk.red('❌ Failed to fetch balances from server'));
      process.exit(1);
    }

    const { sol_balance, tokens } = tokensData.data;

    // Build balance lines
    const balanceLines: string[] = [
      `Address: ${formatPublicKey(publicKey)}`,
      '',
      `${chalk.yellow('- SOL:')}     ${chalk.white(sol_balance.toFixed(9))}`,
    ];

    // Add each token balance
    for (const token of tokens) {
      const formattedAmount = token.ui_amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: token.decimals > 6 ? 6 : token.decimals
      });
      
      // Color-code common tokens
      let tokenColor = chalk.white;
      if (token.symbol === 'USDC') tokenColor = chalk.green;
      else if (token.symbol === 'USDT') tokenColor = chalk.cyan;
      else if (token.symbol === 'BONK') tokenColor = chalk.magenta;
      
      balanceLines.push(`${tokenColor(`- ${token.symbol}:`)}   ${chalk.white(formattedAmount)}`);
    }

    // If no tokens found, note that
    if (tokens.length === 0) {
      balanceLines.push(chalk.gray('(No SPL tokens found)'));
    }

    showInfo('💰 Your Balances', balanceLines);

    flameDivider();
  } catch (error) {
    spinner.stop();
    console.log(chalk.red(`\n❌ Failed to fetch balances: ${error instanceof Error ? error.message : 'Unknown error'}`));
    console.log(chalk.gray('\nMake sure the Fuego server is running: fuego serve'));
    process.exit(1);
  }
}
