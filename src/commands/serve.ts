import chalk from 'chalk';
import { spawn } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { showInfo, flameDivider } from '../lib/ascii.js';

export async function serveCommand(): Promise<void> {
  console.log(); // spacer

  // Find fuego installation
  const openclawPath = path.join(os.homedir(), '.openclaw', 'workspace', 'fuego');
  const localPath = path.join(process.cwd(), 'fuego');
  
  let fuegoPath: string | null = null;
  
  if (fs.existsSync(path.join(openclawPath, 'server'))) {
    fuegoPath = openclawPath;
  } else if (fs.existsSync(path.join(localPath, 'server'))) {
    fuegoPath = localPath;
  }

  if (!fuegoPath) {
    console.log(chalk.red('❌ Fuego server not found.'));
    console.log(chalk.gray('\nRun "fuego install" first to install the Fuego project.'));
    process.exit(1);
  }

  const serverPath = path.join(fuegoPath, 'server');

  showInfo('🔥 Starting Fuego Server', [
    `Location: ${chalk.cyan(serverPath)}`,
    'Command: cargo run',
    '',
    'Server will be available at:',
    chalk.cyan('http://127.0.0.1:8080')
  ]);
  
  flameDivider();
  console.log(); // spacer

  // Spawn cargo run in the server directory
  const child = spawn('cargo', ['run'], {
    cwd: serverPath,
    stdio: 'inherit'
  });

  child.on('error', (error) => {
    console.log(chalk.red(`\n❌ Failed to start server: ${error.message}`));
    console.log(chalk.gray('\nMake sure Rust and Cargo are installed: https://rustup.rs'));
    process.exit(1);
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });
}
