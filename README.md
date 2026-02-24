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

- ⚡ **No passwords** — File permissions = real security
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
└── config.json          # CLI config with versions
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

### `fuego install [options]`

Install the [Fuego project](https://github.com/willmcdeezy/fuego) — Rust server, Python scripts, and dashboard.

**Auto-detection:**
1. Checks for `~/.openclaw/workspace` first (OpenClaw agent machines)
2. If not found, installs to `./fuego` in current directory

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
