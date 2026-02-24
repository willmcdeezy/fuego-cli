import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const CONFIG_DIR = path.join(os.homedir(), '.fuego');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const WALLET_FILE = path.join(CONFIG_DIR, 'wallet.json');
const WALLET_CONFIG_FILE = path.join(CONFIG_DIR, 'wallet-config.json');

// Get current CLI version from package.json
export function getFuegoCliVersion(): string {
  try {
    const pkg = require('../../package.json');
    return pkg.version;
  } catch {
    return '0.1.0';
  }
}

interface Config {
  rpcUrl?: string;
  network?: 'mainnet' | 'devnet' | 'testnet';
  defaultToken?: string;
  'fuego-cli'?: {
    version: string;
    lastUpdated: string;
  };
  fuego?: {
    version: string;
    lastUpdated: string;
    installPath?: string;
  };
  [key: string]: any;
}

interface WalletConfig {
  publicKey: string;
  name?: string;
  label?: string;
  createdAt: string;
  version: string;
}

export function getWalletPath(): string {
  return WALLET_FILE;
}

export function getWalletConfigPath(): string {
  return WALLET_CONFIG_FILE;
}

export function getConfigPath(): string {
  return CONFIG_FILE;
}

export function loadWalletConfig(): WalletConfig | null {
  if (!fs.existsSync(WALLET_CONFIG_FILE)) {
    return null;
  }
  return fs.readJsonSync(WALLET_CONFIG_FILE);
}

export function saveWalletConfig(config: WalletConfig): void {
  fs.ensureDirSync(CONFIG_DIR);
  fs.writeJsonSync(WALLET_CONFIG_FILE, config, { spaces: 2 });
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

export function getConfig(key: string): any {
  const config = loadConfig();
  return config[key];
}

export function setConfig(key: string, value: any): void {
  const config = loadConfig();
  config[key] = value;
  saveConfig(config);
}

export function listConfig(): Config {
  return loadConfig();
}

// Version tracking functions
export function getFuegoCliVersionInfo(): { version: string; lastUpdated: string } | null {
  const config = loadConfig();
  return config['fuego-cli'] || null;
}

export function setFuegoCliVersion(version: string): void {
  const config = loadConfig();
  config['fuego-cli'] = {
    version,
    lastUpdated: new Date().toISOString()
  };
  saveConfig(config);
}

export function getFuegoVersionInfo(): { version: string; lastUpdated: string; installPath?: string } | null {
  const config = loadConfig();
  return config.fuego || null;
}

export function setFuegoVersion(version: string, installPath?: string): void {
  const config = loadConfig();
  config.fuego = {
    version,
    lastUpdated: new Date().toISOString(),
    ...(installPath && { installPath })
  };
  saveConfig(config);
}

// Find fuego installation path
export function findFuegoPath(): string | null {
  // Check config first
  const fuegoInfo = getFuegoVersionInfo();
  if (fuegoInfo?.installPath && fs.existsSync(fuegoInfo.installPath)) {
    return fuegoInfo.installPath;
  }
  
  // Check default locations
  const openclawPath = path.join(os.homedir(), '.openclaw', 'workspace', 'fuego');
  const localPath = path.join(process.cwd(), 'fuego');
  
  if (fs.existsSync(path.join(openclawPath, 'server'))) {
    return openclawPath;
  } else if (fs.existsSync(path.join(localPath, 'server'))) {
    return localPath;
  }
  
  return null;
}
