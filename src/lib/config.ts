import fs from 'fs-extra';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.fuego');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const WALLET_FILE = path.join(CONFIG_DIR, 'wallet.json');
const WALLET_CONFIG_FILE = path.join(CONFIG_DIR, 'wallet-config.json');

interface Config {
  rpcUrl?: string;
  network?: 'mainnet' | 'devnet' | 'testnet';
  defaultToken?: string;
  [key: string]: string | undefined;
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
