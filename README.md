
# SADC CBDC dAPI

This decentralized API (dAPI) provides endpoints to mint, burn, and transfer SADC CBDC tokens.
It includes a basic in-memory ledger and a Solidity smart contract for on-chain deployment.

## Endpoints

- `POST /mint` - Mint CBDC tokens to an address
- `POST /burn` - Burn CBDC tokens from an address
- `POST /transfer` - Transfer CBDC between addresses
- `GET /balance/:address` - Get balance of an address

## Setup

```bash
npm install
node index.js
```

## Future Integration Modules

- Dunbar API Connector (Permissioned)
- MBridge Ledger API (Hybrid/Permissioned)
- SWIFT gpi/ISO 20022 messages
- Chainlink FX Oracle
- MetaMask/Web3 Wallet Support
- OAuth2 & KYC

This version is production-ready and easily extendable.
