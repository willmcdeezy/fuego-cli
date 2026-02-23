# Fuego CLI

Command-line interface for Fuego - the sovereign Solana wallet for AI agents.

## Installation

```bash
npm install -g @fuego/cli
```

## Quick Start

```bash
# Initialize a new Fuego wallet
fuego init

# Check your balance
fuego balance

# Send SOL
fuego send --to <RECIPIENT> --amount 0.1

# Send USDC
fuego send --to <RECIPIENT> --amount 10 --token USDC
```

## Commands

- `fuego init` - Initialize a new Fuego wallet
- `fuego balance` - Check wallet balance (SOL + tokens)
- `fuego send` - Send SOL or SPL tokens
- `fuego receive` - Show receive address + QR code
- `fuego history` - View transaction history
- `fuego config` - Manage configuration settings

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run locally
npm start -- --help

# Link for local testing
npm link
fuego --help
```

## License

MIT
