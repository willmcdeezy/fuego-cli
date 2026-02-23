import chalk from 'chalk';
import ora from 'ora';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

interface InstallOptions {
  path?: string;
}

export async function installCommand(options: InstallOptions): Promise<void> {
  console.log(chalk.cyan.bold('\n🔥 Fuego Project Installation\n'));
  
  // Determine default path: use openclaw workspace if it exists, otherwise current directory
  const openclawWorkspace = path.join(os.homedir(), '.openclaw', 'workspace');
  const hasOpenclaw = fs.existsSync(openclawWorkspace);
  
  const defaultPath = hasOpenclaw 
    ? path.join(openclawWorkspace, 'fuego')
    : path.join(process.cwd(), 'fuego');
  
  const installPath = options.path || defaultPath;
  
  const spinner = ora('Checking installation path...').start();
  
  try {
    // Check if already exists
    if (fs.existsSync(installPath)) {
      spinner.fail('Fuego already installed at this location.');
      console.log(chalk.yellow(`📍 ${installPath}`));
      console.log(chalk.gray('Use --path to install elsewhere, or delete the existing installation.'));
      return;
    }
    
    spinner.text = 'Creating directory...';
    await fs.ensureDir(path.dirname(installPath));
    
    spinner.text = 'Cloning Fuego repository...';
    
    // Clone the main Fuego repo
    const repoUrl = 'https://github.com/willmcdeezy/fuego.git';
    execSync(`git clone ${repoUrl} "${installPath}"`, { stdio: 'pipe' });
    
    spinner.succeed('Fuego installed successfully!');
    
    console.log(chalk.green('\n✅ Fuego is ready'));
    console.log(chalk.white(`\n📍 Installation: ${installPath}`));
    
    // Show contextual next steps
    const relativePath = path.relative(process.cwd(), installPath);
    const cdPath = relativePath.startsWith('..') ? installPath : relativePath;
    
    console.log(chalk.gray('\nNext steps:'));
    console.log(chalk.gray(`  cd ${cdPath.includes(' ') ? `"${cdPath}"` : cdPath}`));
    console.log(chalk.gray('  npm install'));
    console.log(chalk.gray('  npm run start'));
    
  } catch (error: any) {
    spinner.fail(`Installation failed: ${error.message}`);
    
    // Cleanup on failure
    if (fs.existsSync(installPath)) {
      fs.removeSync(installPath);
    }
    
    process.exit(1);
  }
}
