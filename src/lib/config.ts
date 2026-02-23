import fs from 'fs-extra';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.fuego');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

interface Config {
  rpcUrl?: string;
  network?: 'mainnet' | 'devnet' | 'testnet';
  defaultToken?: string;
  [key: string]: string | undefined;
}

export function getConfigPath(): string {
  return path.join(CONFIG_DIR, 'wallet.json');
}

function loadConfig(): Config {
  if (!fs.existsSync(CONFIG_FILE)) {
    return {};
  }
  return fs.readJsonSync(CONFIG_FILE);
}

function saveConfig(config: Config): void {
  fs.ensureDirSync(CONFIG_DIR);
  fs.writeJsonSync(CONFIG_FILE, config, { spaces: 2 });
}

export function getConfig(key: string): string | undefined {
  const config = loadConfig();
  return config[key];
}

export function setConfig(key: string, value: string): void {
  const config = loadConfig();
  config[key] = value;
  saveConfig(config);
}

export function listConfig(): Config {
  return loadConfig();
}
