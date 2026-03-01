import chalk from 'chalk';
import { spawn } from 'child_process';
import path from 'path';
import { loadWalletConfig, findFuegoPath } from '../lib/config.js';
import { showSuccess, showInfo, showError, flameDivider } from '../lib/ascii.js';

interface QuoteOptions {
  input?: string;
  output?: string;
}

const TOKEN_MINTS: { [key: string]: string } = {
  'SOL': 'So11111111111111111111111111111111111111112',
  'USDC': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  'USDT': 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  'BONK': 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  'JUP': 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
};

function resolveToken(token: string): string {
  const upper = token.toUpperCase();
  if (TOKEN_MINTS[upper]) {
    return TOKEN_MINTS[upper];
  }
  // If it's a full mint address, use it directly
  if (token.length === 44) {
    return token;
  }
  return '';
}

export async function jupiterQuoteCommand(amount: string, options: QuoteOptions): Promise<void> {
  console.log();

  // Validate amount
  if (!amount) {
    console.log(chalk.red('❌ Usage: fuego jupiter quote <amount> --input SOL --output USDC'));
    console.log(chalk.gray('\nExamples:'));
    console.log(chalk.gray('  fuego jupiter quote 0.5 --input SOL --output USDC'));
    console.log(chalk.gray('  fuego jupiter quote 10 --input USDC --output BONK'));
    console.log(chalk.gray('\nSupported tokens: SOL, USDC, USDT, BONK, JUP'));
    process.exit(1);
  }

  const amountNum = parseFloat(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    console.log(chalk.red('❌ Invalid amount. Please provide a positive number.'));
    process.exit(1);
  }

  // Validate tokens
  if (!options.input || !options.output) {
    console.log(chalk.red('❌ Both --input and --output tokens are required.'));
    console.log(chalk.gray('Example: --input SOL --output USDC'));
    process.exit(1);
  }

  const inputMint = resolveToken(options.input);
  const outputMint = resolveToken(options.output);

  if (!inputMint) {
    console.log(chalk.red(`❌ Unknown input token: ${options.input}`));
    console.log(chalk.gray('Supported: SOL, USDC, USDT, BONK, JUP'));
    process.exit(1);
  }

  if (!outputMint) {
    console.log(chalk.red(`❌ Unknown output token: ${options.output}`));
    console.log(chalk.gray('Supported: SOL, USDC, USDT, BONK, JUP'));
    process.exit(1);
  }

  // Load wallet
  const walletConfig = loadWalletConfig();
  if (!walletConfig) {
    console.log(chalk.red('❌ No wallet found. Run "fuego create" first.'));
    process.exit(1);
  }

  showInfo('🪐 Jupiter Quote', [
    `From: ${chalk.cyan(options.input.toUpperCase())}`,
    `To: ${chalk.cyan(options.output.toUpperCase())}`,
    `Amount: ${chalk.yellow(amount)}`,
    `Network: ${chalk.gray('mainnet-beta')}`
  ]);

  console.log();
  console.log(chalk.blue('⏳ Fetching quote from Jupiter...'));

  // Find fuego path and call script
  const fuegoPath = findFuegoPath();
  if (!fuegoPath) {
    showError('Fuego installation not found. Run "fuego install" first.');
    process.exit(1);
  }

  const scriptPath = path.join(fuegoPath, 'scripts', 'jupiter', 'jupiter_price.mjs');

  const nodeProcess = spawn('node', [
    scriptPath,
    '--input', options.input,
    '--output', options.output,
    '--amount', amount
  ]);

  nodeProcess.stdout.on('data', (data) => {
    process.stdout.write(data);
  });

  nodeProcess.stderr.on('data', (data) => {
    process.stderr.write(data);
  });

  nodeProcess.on('close', (code) => {
    if (code === 0) {
      flameDivider();
    } else {
      showError('Failed to fetch quote');
      process.exit(1);
    }
  });
}
