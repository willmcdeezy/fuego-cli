import chalk from 'chalk';
import { spawn } from 'child_process';
import path from 'path';
import { loadWalletConfig, findFuegoPath } from '../lib/config.js';
import { showSuccess, showInfo, showError, flameDivider } from '../lib/ascii.js';

interface SwapOptions {
  input?: string;
  output?: string;
  yes?: boolean;
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
  if (token.length === 44) {
    return token;
  }
  return '';
}

export async function jupiterSwapCommand(amount: string, options: SwapOptions): Promise<void> {
  console.log();

  // Validate amount
  if (!amount) {
    console.log(chalk.red('❌ Usage: fuego jupiter swap <amount> --input SOL --output USDC [--yes]'));
    console.log(chalk.gray('\nExamples:'));
    console.log(chalk.gray('  fuego jupiter swap 0.5 --input SOL --output USDC'));
    console.log(chalk.gray('  fuego jupiter swap 10 --input USDC --output BONK --yes'));
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

  // Show transaction preview
  showInfo('🪐 Jupiter Swap Preview', [
    `From: ${chalk.yellow(amount)} ${chalk.cyan(options.input.toUpperCase())}`,
    `To: ${chalk.cyan(options.output.toUpperCase())}`,
    `Wallet: ${chalk.gray(walletConfig.publicKey.substring(0, 16))}...`,
    `Network: ${chalk.gray('mainnet-beta')}`
  ]);

  // Confirm unless --yes
  if (!options.yes) {
    console.log();
    console.log(chalk.yellow('⚠️  Add --yes to confirm and execute swap'));
    console.log(chalk.gray('Or run first: fuego jupiter quote ' + amount + ' --input ' + options.input + ' --output ' + options.output));
    flameDivider();
    return;
  }

  console.log();
  console.log(chalk.blue('⏳ Executing Jupiter swap...'));
  console.log(chalk.gray('This may take a moment...'));

  // Find fuego path and call script
  const fuegoPath = findFuegoPath();
  if (!fuegoPath) {
    showError('Fuego installation not found. Run "fuego install" first.');
    process.exit(1);
  }

  const scriptPath = path.join(fuegoPath, 'scripts', 'jupiter', 'jupiter_swap_regular.mjs');

  const nodeProcess = spawn('node', [
    scriptPath,
    '--input', options.input,
    '--output', options.output,
    '--amount', amount
  ]);

  let output = '';

  nodeProcess.stdout.on('data', (data) => {
    output += data.toString();
    process.stdout.write(data);
  });

  nodeProcess.stderr.on('data', (data) => {
    process.stderr.write(data);
  });

  nodeProcess.on('close', (code) => {
    if (code === 0) {
      // Extract signature from output if present
      const sigMatch = output.match(/Signature: ([A-Za-z0-9]+)/);
      if (sigMatch) {
        showSuccess(
          '✅ Swap Complete!',
          `${chalk.yellow(amount)} ${chalk.cyan(options.input.toUpperCase())} → ${chalk.cyan(options.output.toUpperCase())}`
        );
      } else {
        showSuccess('✅ Swap Executed!', '');
      }
      flameDivider();
    } else {
      showError('Swap failed. Check output above for details.');
      process.exit(1);
    }
  });
}
