import chalk from 'chalk';
import { exec } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { promisify } from 'util';
import { showInfo, flameDivider } from '../lib/ascii.js';
import { findFuegoPath } from '../lib/config.js';

const execAsync = promisify(exec);

export async function dashboardCommand(): Promise<void> {
  console.log(); // spacer

  // Find fuego installation (checks config first, then falls back to auto-detect)
  const fuegoPath = findFuegoPath();

  if (!fuegoPath || !fs.existsSync(path.join(fuegoPath, 'dashboard', 'dashboard.html'))) {
    console.log(chalk.red('❌ Fuego dashboard not found.'));
    console.log(chalk.gray('\nRun "fuego install" first to install the Fuego project.'));
    process.exit(1);
  }

  const dashboardPath = path.join(fuegoPath, 'dashboard', 'dashboard.html');

  showInfo('🔥 Opening Fuego Dashboard', [
    `Location: ${chalk.cyan(dashboardPath)}`
  ]);

  flameDivider();

  // Open the dashboard based on platform
  const platform = process.platform;
  let command: string;

  switch (platform) {
    case 'darwin': // macOS
      command = `open "${dashboardPath}"`;
      break;
    case 'linux':
      command = `xdg-open "${dashboardPath}"`;
      break;
    case 'win32':
      command = `start "" "${dashboardPath}"`;
      break;
    default:
      console.log(chalk.yellow(`⚠️  Unsupported platform: ${platform}`));
      console.log(chalk.gray(`Please open manually: ${dashboardPath}`));
      return;
  }

  try {
    await execAsync(command);
    console.log(chalk.green('\n✅ Dashboard opened!'));
    console.log(chalk.gray('Note: Make sure the Fuego server is running (fuego serve)'));
  } catch (error) {
    console.log(chalk.yellow('\n⚠️  Could not open dashboard automatically.'));
    console.log(chalk.gray(`Please open manually: ${dashboardPath}`));
  }
}
