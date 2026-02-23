# 🔥 @fuego/cli

Command-line interface for Fuego - the sovereign Solana wallet for AI agents.

![Fuego Banner](https://raw.githubusercontent.com/willmcdeezy/fuego-cli/main/assets/banner.png)

## Installation

```bash
npm install -g @fuego/cli
```

## Quick Start

```bash
# See the fire banner and help
fuego --help

# Create a new Fuego wallet
fuego create --name my-wallet

# Install the main Fuego project
fuego install
```

## Commands

### `fuego create [options]`

Create a new Fuego wallet with style.

**Options:**
- `-f, --force` - Overwrite existing wallet
- `-n, --name <name>` - Name your wallet (default: "default")
- `-d, --directory <path>` - Custom config directory

**Example:**
```bash
fuego create --name prod-wallet
```

Creates:
```
~/.fuego/
├── wallet.json          # Private key (minimal, 600 permissions)
├── wallet-config.json   # Wallet metadata (name, publicKey, createdAt)
└── config.json          # CLI settings (RPC URL, network)
```

### `fuego install [options]`

Install the main Fuego project.

**Options:**
- `-p, --path <path>` - Installation path

**Smart defaults:**
- If `~/.openclaw/workspace` exists → installs there (agent machine)
- Otherwise → installs to `./fuego` (like create-react-app)

**Example:**
```bash
# Auto-detect best location
fuego install

# Custom path
fuego install --path ~/projects/my-fuego
```

## Features

- 🔥 **Fire-themed UI** — ASCII art, gradient colors, boxed messages
- 🤖 **Agent-aware** — Auto-detects OpenClaw workspace
- 🛡️ **Sovereign** — Your keys, your control
- 📦 **Zero-conf** — Sensible defaults, works out of the box

## Development

```bash
# Clone and setup
git clone https://github.com/willmcdeezy/fuego-cli.git
cd fuego-cli
npm install

# Build (uses npx tsc)
npm run build

# Test locally
npm start -- --help
npm start create --name test

# Link for global testing
npm link
fuego --help
```

## Security

- Private keys stored with `0o600` permissions (owner read/write only)
- Wallet data separated from configuration
- Local-first — no cloud services, no hosted wallets

## License

MIT

---

Built with 🔥 for the agent economy.
