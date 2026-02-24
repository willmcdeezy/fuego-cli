import chalk from 'chalk';
import ora from 'ora';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { setFuegoVersion } from '../lib/config.js';
import { showSuccess, showWarning, showInfo, flameDivider } from '../lib/ascii.js';

interface InstallOptions {
  path?: string;
}

export async function installCommand(options: InstallOptions): Promise<void> {
  console.log(); // spacer
  
  // Determine default path: use openclaw workspace if it exists, otherwise current directory
  const openclawWorkspace = path.join(os.homedir(), '.openclaw', 'workspace');
  const hasOpenclaw = fs.existsSync(openclawWorkspace);
  
  const defaultPath = hasOpenclaw 
    ? path.join(openclawWorkspace, 'fuego')
    : path.join(process.cwd(), 'fuego');
  
  const installPath = options.path || defaultPath;
  
  const spinner = ora({
    text: 'Checking installation path...',
    color: 'yellow'
  }).start();
  
  try {
    // Check if already exists
    if (fs.existsSync(installPath)) {
      spinner.stop();
      showWarning(
        `Fuego already installed at:\n${chalk.cyan(installPath)}\n\nUse --path to install elsewhere, or delete the existing installation.`
      );
      return;
    }
    
    spinner.text = 'Creating directory...';
    spinner.color = 'cyan';
    await fs.ensureDir(path.dirname(installPath));
    
    spinner.text = 'Cloning Fuego repository...';
    spinner.color = 'red';
    
    // Clone the main Fuego repo
    const repoUrl = 'https://github.com/willmcdeezy/fuego.git';
    execSync(`git clone ${repoUrl} "${installPath}"`, { stdio: 'pipe' });
    
    spinner.stop();
    
    // Get the commit hash as version
    const commitHash = execSync('git rev-parse --short HEAD', { 
      cwd: installPath 
    }).toString().trim();
    
    // Store version info
    setFuegoVersion(commitHash, installPath);
    
    // Show contextual next steps
    const relativePath = path.relative(process.cwd(), installPath);
    const cdPath = relativePath.startsWith('..') ? installPath : relativePath;
    const safeCdPath = cdPath.includes(' ') ? `"${cdPath}"` : cdPath;
    
    showSuccess(
      '🔥 Fuego Installed Successfully!',
      `Location: ${chalk.cyan(installPath)}\nVersion: ${chalk.cyan(commitHash)}`
    );
    
    showInfo('🚀 Next Steps', [
      `cd ${safeCdPath}`,
      'npm install',
      'npm run start'
    ]);
    
    flameDivider();
    
  } catch (error: any) {
    spinner.fail(chalk.red(`Installation failed: ${error.message}`));
    
    // Cleanup on failure
    if (fs.existsSync(installPath)) {
      fs.removeSync(installPath);
    }
    
    process.exit(1);
  }
}
