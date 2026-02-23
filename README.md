# Fuego CLI

Command-line interface for Fuego - the sovereign Solana wallet for AI agents.

## Installation

```bash
npm install -g @fuego/cli
```

## Quick Start

### For Agents

```bash
# Create a new Fuego wallet
fuego create

# Install the main Fuego project
fuego install
```

### Commands

- `fuego create` - Create a new Fuego wallet
  - `-f, --force` - Overwrite existing wallet
  - `-n, --name <name>` - Name your wallet (default: "default")
  - `-d, --directory <path>` - Custom config directory

- `fuego install` - Install the main Fuego project
  - `-p, --path <path>` - Installation path (default: `~/.openclaw/workspace/fuego`)

## File Structure

After running `fuego create`, your wallet files are stored in `~/.fuego/`:

```
~/.fuego/
├── wallet.json          # Private key (minimal, 600 permissions)
├── wallet-config.json   # Wallet metadata (name, publicKey, createdAt)
└── config.json          # CLI settings (RPC URL, network)
```

## Development

```bash
# Install dependencies
npm install

# Build (uses npx tsc for proper TS imports)
npm run build

# Run locally
npm start -- --help

# Link for local testing
npm link
fuego --help
```

## License

MIT
