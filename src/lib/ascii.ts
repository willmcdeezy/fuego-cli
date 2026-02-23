import figlet from 'figlet';
import gradient from 'gradient-string';
import boxen from 'boxen';
import chalk from 'chalk';

// Fire gradient for Fuego branding
const fireGradient = gradient(['#ff6b35', '#f7931e', '#ffd23f']);

/**
 * Display the Fuego ASCII banner
 */
export function showBanner(): void {
  const banner = figlet.textSync('FUEGO', {
    font: 'Big',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  });
  
  console.log(fireGradient.multiline(banner));
  console.log(chalk.gray('  Sovereign Solana wallet for AI agents\n'));
}

/**
 * Display a success message in a box
 */
export function showSuccess(title: string, message: string): void {
  const content = `${chalk.bold.green(title)}\n\n${message}`;
  console.log(
    boxen(content, {
      padding: 1,
      margin: { top: 1, bottom: 1 },
      borderStyle: 'round',
      borderColor: 'green',
      backgroundColor: '#0a0a0a'
    })
  );
}

/**
 * Display an error message in a box
 */
export function showError(message: string): void {
  console.log(
    boxen(chalk.red(message), {
      padding: 1,
      margin: { top: 1, bottom: 1 },
      borderStyle: 'bold',
      borderColor: 'red'
    })
  );
}

/**
 * Display a warning message in a box
 */
export function showWarning(message: string): void {
  console.log(
    boxen(chalk.yellow(message), {
      padding: 1,
      margin: { top: 0, bottom: 1 },
      borderStyle: 'round',
      borderColor: 'yellow'
    })
  );
}

/**
 * Display info in a subtle box
 */
export function showInfo(title: string, lines: string[]): void {
  const content = chalk.bold.cyan(title) + '\n\n' + lines.map(l => chalk.white(l)).join('\n');
  console.log(
    boxen(content, {
      padding: 1,
      margin: { top: 0, bottom: 1 },
      borderStyle: 'single',
      borderColor: 'cyan'
    })
  );
}

/**
 * Format a public key with fire styling
 */
export function formatPublicKey(key: string): string {
  return fireGradient(key);
}

/**
 * Show a flame divider
 */
export function flameDivider(): void {
  console.log(fireGradient('━'.repeat(50)));
}
