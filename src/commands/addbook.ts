import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { showSuccess, showInfo, showWarning, flameDivider } from '../lib/ascii.js';

const CONTACTS_DIR = path.join(os.homedir(), '.fuego', 'contacts');
const ADDRESS_BOOK_FILE = path.join(CONTACTS_DIR, 'address-book.json');

interface ContactEntry {
  address: string;
  label?: string;
  addedAt: string;
}

interface AddressBook {
  [name: string]: ContactEntry;
}

function loadAddressBook(): AddressBook {
  if (!fs.existsSync(ADDRESS_BOOK_FILE)) {
    return {};
  }
  return fs.readJsonSync(ADDRESS_BOOK_FILE);
}

function saveAddressBook(book: AddressBook): void {
  fs.ensureDirSync(CONTACTS_DIR);
  fs.writeJsonSync(ADDRESS_BOOK_FILE, book, { spaces: 2 });
}

function isValidSolanaAddress(address: string): boolean {
  // Basic Solana address validation (32-44 chars, base58)
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

// Add a contact
export async function addBookAddCommand(name: string, address: string, options: { label?: string }): Promise<void> {
  console.log();

  if (!name || !address) {
    console.log(chalk.red('❌ Usage: fuego addbook add <name> <address> [--label "description"]'));
    process.exit(1);
  }

  // Validate address
  if (!isValidSolanaAddress(address)) {
    console.log(chalk.red('❌ Invalid Solana address format.'));
    process.exit(1);
  }

  const book = loadAddressBook();

  // Check if name already exists
  if (book[name]) {
    showWarning(`Contact "${name}" already exists.\n\nUse a different name or remove the existing contact first.`);
    return;
  }

  // Add contact
  book[name] = {
    address,
    label: options.label,
    addedAt: new Date().toISOString()
  };

  saveAddressBook(book);

  showSuccess(
    '✅ Contact Added',
    `Name: ${chalk.cyan(name)}\nAddress: ${chalk.cyan(address.slice(0, 8))}...${chalk.cyan(address.slice(-8))}${options.label ? '\nLabel: ' + chalk.cyan(options.label) : ''}`
  );

  flameDivider();
}

// List all contacts
export async function addBookListCommand(): Promise<void> {
  console.log();

  const book = loadAddressBook();
  const contacts = Object.entries(book);

  if (contacts.length === 0) {
    showInfo('📒 Address Book', ['No contacts yet.', '', chalk.yellow('Add one: fuego addbook add <name> <address>')]);
    flameDivider();
    return;
  }

  const lines: string[] = [`${contacts.length} contact${contacts.length === 1 ? '' : 's'}\n`];

  for (const [name, entry] of contacts) {
    const shortAddr = `${entry.address.slice(0, 6)}...${entry.address.slice(-6)}`;
    lines.push(`${chalk.cyan(name)}: ${chalk.white(shortAddr)}${entry.label ? chalk.gray(` (${entry.label})`) : ''}`);
  }

  showInfo('📒 Address Book', lines);
  flameDivider();
}

// Show a specific contact
export async function addBookShowCommand(name: string): Promise<void> {
  console.log();

  if (!name) {
    console.log(chalk.red('❌ Usage: fuego addbook show <name>'));
    process.exit(1);
  }

  const book = loadAddressBook();
  const entry = book[name];

  if (!entry) {
    console.log(chalk.red(`❌ Contact "${name}" not found.`));
    console.log(chalk.gray('\nUse "fuego addbook list" to see all contacts.'));
    process.exit(1);
  }

  showInfo(`📇 ${name}`, [
    `Address: ${chalk.white(entry.address)}`,
    entry.label ? `Label: ${chalk.cyan(entry.label)}` : '',
    `Added: ${chalk.gray(new Date(entry.addedAt).toLocaleDateString())}`
  ].filter(Boolean));

  flameDivider();
}

// Remove a contact
export async function addBookRemoveCommand(name: string, options: { yes?: boolean }): Promise<void> {
  console.log();

  if (!name) {
    console.log(chalk.red('❌ Usage: fuego addbook remove <name> [--yes]'));
    process.exit(1);
  }

  const book = loadAddressBook();

  if (!book[name]) {
    console.log(chalk.red(`❌ Contact "${name}" not found.`));
    process.exit(1);
  }

  // Confirm unless --yes flag
  if (!options.yes) {
    showWarning(`About to remove "${name}" (${book[name].address.slice(0, 8)}...${book[name].address.slice(-8)})\n\nUse --yes to confirm, or omit to review.`);
    return;
  }

  delete book[name];
  saveAddressBook(book);

  showSuccess('✅ Contact Removed', `Removed "${chalk.cyan(name)}" from address book.`);
  flameDivider();
}
