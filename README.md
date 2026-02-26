# 🔥 fuego-cli

<div align="center">
  
<pre>
███████╗██╗   ██╗███████╗ ██████╗  ██████╗ 
██╔════╝██║   ██║██╔════╝██╔════╝ ██╔═══██╗
█████╗  ██║   ██║█████╗  ██║  ███╗██║   ██║
██╔══╝  ██║   ██║██╔══╝  ██║   ██║██║   ██║
██║     ╚██████╔╝███████╗╚██████╔╝╚██████╔╝ 
╚═╝      ╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝ 
  </pre>
  <h3>🔥🦞 Agentic Solana Wallet CLI 🦞🔥</h3>
  <p><strong>Zero friction. Maximum agent autonomy.</strong></p>
  
  <p>
    <a href="https://www.npmjs.com/package/fuego-cli"><img src="https://img.shields.io/npm/v/fuego-cli.svg?style=flat-square" alt="npm version"></a>
    <a href="https://github.com/willmcdeezy/fuego-cli/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License"></a>
  </p>
</div>

---

## Why Fuego?

**The first Solana wallet CLI designed FOR autonomous agents.**

- ⚡ **Zero friction** — No prompts, no waiting, just instant signing
- 🤖 **Agent-first** — Built for automated workflows
- 🏠 **Local-only** — Keys never leave your machine
- 🔄 **Auto-updating** — Stay current with `fuego update`

---

## Installation

```bash
npm install -g fuego-cli
```

---

## Quick Start

```bash
# 1. Create a wallet
fuego create

# 2. Install the Fuego server & tools
fuego install

# 3. Start the server
fuego serve

# 4. Check your balance
fuego balance

# 5. Open the dashboard
fuego dashboard
```

---

## Commands

### Wallet Management

| Command | Description |
|---------|-------------|
| `fuego create` | Create a new Solana wallet |
| `fuego address` | Show your wallet address |
| `fuego balance` | Check SOL, USDC, USDT balances |
| `fuego rpc` | Show or configure your Solana RPC endpoint |
| `fuego contacts` | Manage your contacts |
| `fuego fund` | Show funding options: MoonPay link + QR code |
| `fuego send` | Send SOL, USDC, or USDT to an address or contact |

### Project Management

| Command | Description |
|---------|-------------|
| `fuego install` | Install the [Fuego server & tools](https://github.com/willmcdeezy/fuego) |
| `fuego serve` | Start the Rust server (`cargo run`) |
| `fuego dashboard` | Open the HTML dashboard |
| `fuego update` | Update CLI and/or Fuego project |

---

## Detailed Usage

### `fuego create [options]`

Create a new Fuego wallet with zero passwords.

```bash
fuego create --name prod-wallet
```

**Options:**
- `-f, --force` — Overwrite existing wallet
- `-n, --name <name>` — Wallet name (default: "default")

**Creates:**
```
~/.fuego/
├── wallet.json          # Private key (600 permissions)
├── wallet-config.json   # Public key + metadata
├── config.json          # CLI config with versions
└── contacts/
    └── address-book.json  # Your saved contacts
```

---

### `fuego balance`

Check balances via the Fuego server.

```bash
fuego balance
# or
fuego bal
```

**Output:**
```
💰 Your Balances

Address: DmFy...eUZF

- SOL:     1.234567890
- USDC:   $0.00
- USDT:   $0.00
```

---

### `fuego serve`

Start the Fuego Rust server.

```bash
fuego serve
```

Auto-detects installation at:
- `~/.openclaw/workspace/fuego` (OpenClaw agents)
- `./fuego` (local installs)

---

### `fuego dashboard`

Open the dashboard in your default browser.

```bash
fuego dashboard
# or
fuego dash
```

---

### `fuego update [options]`

Update everything with one command.

```bash
# Update both
fuego update

# Update only CLI
fuego update --cli

# Update only Fuego project
fuego update --fuego
```

**Tracks versions in `~/.fuego/config.json`:**
```json
{
  "fuego-cli": {
    "version": "0.1.0",
    "lastUpdated": "2026-02-24T18:30:00.000Z"
  },
  "fuego": {
    "version": "a1b2c3d",
    "lastUpdated": "2026-02-24T18:35:00.000Z"
  }
}
```

---

### `fuego rpc [options]`

Show or configure your Solana RPC endpoint for faster or more reliable connections.

```bash
# Show current RPC configuration
fuego rpc

# Set a custom RPC endpoint
fuego rpc --url https://helius.xyz/... --network mainnet

# Use public mainnet
fuego rpc --url https://api.mainnet-beta.solana.com
```

**Options:**
- `-u, --url <url>` — RPC endpoint URL
- `-n, --network <network>` — Network type: `mainnet`, `devnet`, `testnet` (default: `mainnet`)

---

### `fuego contacts <subcommand>`

Manage your contacts for quick access to frequently used addresses.

```bash
# Add a contact
fuego contacts add melanie GvCoHGGBR97Yphzc6SrRycZyS31oUYBM8m9hLRtJT7r5 --label "Melanie's wallet"

# List all contacts
fuego contacts list

# Show specific contact
fuego contacts show melanie

# Remove contact (with confirmation)
fuego contacts remove melanie --yes
```

**Storage:** `~/.fuego/contacts/address-book.json`

**Commands:**
- `add <name> <address> [--label "description"]` — Add a contact
- `list` — Show all contacts
- `show <name>` — Show contact details
- `remove <name> [--yes]` — Remove a contact

---

### `fuego fund`

Show funding options for your wallet: MoonPay onramp link + QR codes for easy scanning.

```bash
fuego fund
```

**Output:**
- Your wallet address (plain text for copying)
- QR code of your address (scan to receive SOL from another wallet)
- MoonPay onramp URL (buy SOL with card/bank, pre-filled with your address)
- QR code for MoonPay link (scan to open on mobile)

**Example:**
```
💰 Fund Your Wallet
Address: DmFyLRiJtc4Bz75hjAqPaEJpDfRe4GEnRLPwc3EgeUZF

📱 Scan to receive SOL:

[QR CODE]

🔗 MoonPay Onramp
Buy SOL with card/bank and send directly to your wallet:

https://buy.moonpay.com/?currencyCode=SOL&walletAddress=DmFyLRiJtc4Bz75hjAqPaEJpDfRe4GEnRLPwc3EgeUZF

Or scan this QR code to fund:

[QR CODE]
```

**Note:** MoonPay requires KYC and is available in supported regions. The QR code for your address works with any Solana wallet (Phantom, Solflare, etc.).

---

### `fuego send <recipient> <amount>`

Send SOL, USDC, or USDT to a Solana address or address book contact.

```bash
# Send SOL to an address
fuego send GvCoHGGBR97Yphzc6SrRycZyS31oUYBM8m9hLRtJT7r5 0.5 --token SOL

# Send USDC to a contact
fuego send melanie 10 --token USDC

# Send and confirm immediately
fuego send melanie 5 --token USDT --yes
```

**Options:**
- `-t, --token <token>` — **Required.** Token to send: `SOL`, `USDC`, or `USDT`
- `-y, --yes` — Skip confirmation prompt and send immediately

**Recipient can be:**
- A full Solana address (e.g., `GvCoHGGBR97Yphzc6SrRycZyS31oUYBM8m9hLRtJT7r5`)
- A contact name (e.g., `melanie`)

**Safety:** By default, `fuego send` shows a transaction preview and requires `--yes` to confirm. This prevents accidental sends.

---

### `fuego install [options]`

Install the [Fuego project](https://github.com/willmcdeezy/fuego) — Rust server, Python scripts, and dashboard.

**Auto-detection:**
1. Checks for `~/.openclaw/workspace` first (OpenClaw agent machines)
2. If not found, creates `./fuego` in your **current directory**

> **Note:** This installs the Fuego server to `./fuego/` (or your custom path), not to `~/.fuego/`. The `~/.fuego/` folder is only for your wallet files and CLI config.

```bash
# Auto-detect best location
fuego install

# Custom path
fuego install --path ~/projects/my-fuego
```

---

## Architecture

```
┌─────────────────┐
│   fuego-cli     │  ← This package (wallet + commands)
│  (Node.js/npm)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   ~/.fuego/     │  ← Wallet storage
│   wallet.json   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Fuego Server   │  ← Rust server (separate repo)
│  (cargo run)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Solana Network │  ← mainnet/devnet
└─────────────────┘
```

---

## Development

```bash
git clone https://github.com/willmcdeezy/fuego-cli.git
cd fuego-cli
npm install
npm run build
npm link  # Global testing
```

---

## Security

- ✅ Private keys: `chmod 600` (owner only)
- ✅ Local-first: No cloud, no hosted wallets
- ✅ Separate concerns: CLI vs server vs wallet

---

## Related Projects

- 🔥 [fuego](https://github.com/willmcdeezy/fuego) — Rust server, Python scripts, dashboard

---

## License

MIT © Will McDeezy

---

<div align="center">
  <sub>Built with 🔥 for the agent economy</sub>
</div>
