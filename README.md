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
  <h3>🔥🦞 Agentic Solana Wallet 🦞🔥</h3>
  <p>Zero friction. Maximum agent autonomy.</p>
</div>

## Installation

```bash
npm install -g fuego-cli
```

## Quick Start

```bash
# See the fire banner and help
fuego --help

# Create a new Fuego wallet
fuego create --name my-wallet

# Check your balances
fuego balance

# Install the main Fuego project
fuego install

# Start the server
fuego serve

# Open the dashboard (in another terminal)
fuego dashboard
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

### `fuego balance`

Check your wallet balances (SOL, USDC, USDT) on mainnet.

**Example:**
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

### `fuego serve`

Start the Fuego Rust server (runs `cargo run` in the server directory).

**Example:**
```bash
fuego serve
```

**Auto-detects Fuego installation:**
- Checks `~/.openclaw/workspace/fuego` first (agent machines)
- Falls back to `./fuego` (local installs)

**Output:**
```
🔥 Starting Fuego Server

Location: ~/.openclaw/workspace/fuego/server
Command: cargo run

Server will be available at:
http://127.0.0.1:8080
```

### `fuego dashboard`

Open the Fuego dashboard in your default browser.

**Alias:** `fuego dash`

**Example:**
```bash
fuego dashboard
```

**Note:** Make sure the Fuego server is running (`fuego serve`) for the dashboard to work properly.

### `fuego install [options]`

Install the main [Fuego project](https://github.com/willmcdeezy/fuego) — the Rust server, Python scripts, and HTML dashboard for agent-ready Solana transactions.

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
