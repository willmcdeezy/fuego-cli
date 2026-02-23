import { 
  Keypair, 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram,
  LAMPORTS_PER_SOL 
} from '@solana/web3.js';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { getWalletPath } from './config.js';

export interface WalletBalance {
  sol: number;
  tokens: Array<{
    mint: string;
    symbol: string;
    amount: string;
    decimals: number;
  }>;
}

export interface SendResult {
  signature: string;
  confirmation: string;
}

export interface TransactionRecord {
  signature: string;
  type: 'incoming' | 'outgoing';
  amount: string;
  token: string;
  timestamp: number;
  counterparty?: string;
}

export class FuegoWallet {
  private walletPath: string;
  private keypair?: Keypair;
  
  constructor(walletPath?: string) {
    this.walletPath = walletPath || getWalletPath();
  }
  
  exists(): boolean {
    return fs.existsSync(this.walletPath);
  }
  
  async create(): Promise<{ publicKey: string; mnemonic?: string }> {
    // Ensure directory exists
    await fs.ensureDir(path.dirname(this.walletPath));
    
    // Generate new keypair
    this.keypair = Keypair.generate();
    
    // Save to file (encrypted in future versions)
    const walletData = {
      publicKey: this.keypair.publicKey.toBase58(),
      secretKey: Array.from(this.keypair.secretKey),
      version: '0.1.0',
      createdAt: new Date().toISOString()
    };
    
    await fs.writeJson(this.walletPath, walletData, { spaces: 2 });
    
    // Set restrictive permissions (owner read/write only)
    await fs.chmod(this.walletPath, 0o600);
    
    return {
      publicKey: this.keypair.publicKey.toBase58(),
      // Note: We're not using mnemonic phrases in v0.1 - direct keypair generation
      mnemonic: undefined
    };
  }
  
  load(): Keypair {
    if (this.keypair) return this.keypair;
    
    if (!this.exists()) {
      throw new Error('Wallet not found. Run "fuego init" first.');
    }
    
    const walletData = fs.readJsonSync(this.walletPath);
    this.keypair = Keypair.fromSecretKey(Uint8Array.from(walletData.secretKey));
    
    return this.keypair;
  }
  
  getPublicKey(): string {
    if (this.keypair) {
      return this.keypair.publicKey.toBase58();
    }
    
    if (!this.exists()) {
      throw new Error('Wallet not found. Run "fuego init" first.');
    }
    
    const walletData = fs.readJsonSync(this.walletPath);
    return walletData.publicKey;
  }
  
  async getBalance(): Promise<WalletBalance> {
    const keypair = this.load();
    const connection = this.getConnection();
    
    const lamports = await connection.getBalance(keypair.publicKey);
    
    // TODO: Fetch SPL token balances
    
    return {
      sol: lamports / LAMPORTS_PER_SOL,
      tokens: []
    };
  }
  
  async send(params: {
    to: string;
    amount: number;
    token: string;
    network?: string;
  }): Promise<SendResult> {
    const keypair = this.load();
    const connection = this.getConnection(params.network);
    
    const recipient = new PublicKey(params.to);
    
    if (params.token === 'SOL') {
      const lamports = params.amount * LAMPORTS_PER_SOL;
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: recipient,
          lamports
        })
      );
      
      const signature = await connection.sendTransaction(transaction, [keypair]);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');
      
      return {
        signature,
        confirmation: 'confirmed'
      };
    } else {
      // TODO: SPL token transfers
      throw new Error('SPL token transfers coming in v0.2');
    }
  }
  
  async getHistory(limit: number): Promise<TransactionRecord[]> {
    const keypair = this.load();
    const connection = this.getConnection();
    
    const signatures = await connection.getSignaturesForAddress(
      keypair.publicKey,
      { limit }
    );
    
    return signatures.map(sig => ({
      signature: sig.signature,
      type: sig.err ? 'outgoing' : 'incoming', // Simplified - actual logic needs transaction parsing
      amount: '0', // TODO: Parse actual amount
      token: 'SOL',
      timestamp: sig.blockTime ? sig.blockTime * 1000 : Date.now(),
    }));
  }
  
  private getConnection(rpcUrl?: string): Connection {
    const endpoint = rpcUrl || process.env.FUEGO_RPC_URL || 'https://api.mainnet-beta.solana.com';
    return new Connection(endpoint, 'confirmed');
  }
}
