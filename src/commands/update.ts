import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import { 
  getFuegoCliVersion, 
  getFuegoCliVersionInfo, 
  getFuegoVersionInfo, 
  findFuegoPath,
  setFuegoCliVersion,
  setFuegoVersion 
} from '../lib/config.js';
import { showSuccess, showInfo, showWarning, flameDivider } from '../lib/ascii.js';

interface UpdateOptions {
  cli?: boolean;
  fuego?: boolean;
}

export async function updateCommand(options: UpdateOptions): Promise<void> {
  console.log(); // spacer
  
  const updateCli = options.cli || (!options.cli && !options.fuego);
  const updateFuego = options.fuego || (!options.cli && !options.fuego);
  
  const currentCliVersion = getFuegoCliVersion();
  const cliInfo = getFuegoCliVersionInfo();
  const fuegoInfo = getFuegoVersionInfo();
  const fuegoPath = findFuegoPath();
  
  // Show current versions
  showInfo('📦 Current Versions', [
    `fuego-cli: ${chalk.cyan(cliInfo?.version || currentCliVersion)} ${cliInfo?.lastUpdated ? chalk.gray(`(updated: ${new Date(cliInfo.lastUpdated).toLocaleDateString()})`) : ''}`,
    `fuego: ${chalk.cyan(fuegoInfo?.version || 'not installed')} ${fuegoInfo?.lastUpdated ? chalk.gray(`(updated: ${new Date(fuegoInfo.lastUpdated).toLocaleDateString()})`) : ''}`,
  ]);
  console.log(); // spacer
  
  let cliUpdated = false;
  let fuegoUpdated = false;
  
  // Update fuego-cli
  if (updateCli) {
    const spinner = ora('Checking for fuego-cli updates...').start();
    
    try {
      spinner.text = 'Updating fuego-cli...';
      execSync('npm install -g fuego-cli@latest', { stdio: 'pipe' });
      spinner.stop();
      
      setFuegoCliVersion(currentCliVersion);
      showSuccess('✅ fuego-cli updated!', `Version: ${chalk.cyan(currentCliVersion)}`);
      cliUpdated = true;
    } catch (error: any) {
      spinner.stop();
      console.log(chalk.red(`❌ Failed to update fuego-cli: ${error.message}`));
      console.log(chalk.gray('You may need to run with sudo or check your npm permissions.'));
    }
    console.log(); // spacer
  }
  
  // Update fuego project
  if (updateFuego) {
    if (!fuegoPath) {
      showWarning('Fuego project not found.\n\nRun "fuego install" first.');
      return;
    }
    
    const spinner = ora('Checking for fuego updates...').start();
    
    try {
      // Check if it's a git repo
      const gitPath = path.join(fuegoPath, '.git');
      if (!fs.existsSync(gitPath)) {
        spinner.stop();
        showWarning('Fuego installation is not a git repository.\n\nCannot auto-update. You may need to reinstall.');
        return;
      }
      
      spinner.text = 'Pulling latest changes...';
      execSync('git pull origin main', { 
        cwd: fuegoPath, 
        stdio: 'pipe' 
      });
      
      spinner.stop();
      
      // Get the latest commit hash as version
      const commitHash = execSync('git rev-parse --short HEAD', { 
        cwd: fuegoPath 
      }).toString().trim();
      
      setFuegoVersion(commitHash, fuegoPath);
      showSuccess('✅ fuego updated!', `Version: ${chalk.cyan(commitHash)}`);
      showInfo('📍 Location', [fuegoPath]);
      
      console.log(); // spacer
      console.log(chalk.yellow('📝 Note: You may need to rebuild the server:'));
      console.log(chalk.gray(`  cd ${fuegoPath}/server && cargo build`));
      
      fuegoUpdated = true;
    } catch (error: any) {
      spinner.stop();
      console.log(chalk.red(`❌ Failed to update fuego: ${error.message}`));
      
      if (error.message.includes('not a git repository')) {
        console.log(chalk.gray('The fuego installation may have been downloaded as a ZIP or installed differently.'));
        console.log(chalk.gray('Run "fuego install" to get a fresh copy that can be updated.'));
      }
    }
  }
  
  flameDivider();
  
  if (cliUpdated || fuegoUpdated) {
    console.log(chalk.green('\n✨ Update complete!'));
  } else {
    console.log(chalk.yellow('\n⚠️  Some updates failed. Check the errors above.'));
  }
}
