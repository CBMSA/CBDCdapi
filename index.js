
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Sample in-memory ledger
let ledger = {};

// Mint CBDC
app.post('/mint', (req, res) => {
    const { address, amount } = req.body;
    if (!ledger[address]) ledger[address] = 0;
    ledger[address] += amount;
    res.json({ success: true, balance: ledger[address] });
});

// Burn CBDC
app.post('/burn', (req, res) => {
    const { address, amount } = req.body;
    if (!ledger[address] || ledger[address] < amount) {
        return res.status(400).json({ success: false, message: "Insufficient balance" });
    }
    ledger[address] -= amount;
    res.json({ success: true, balance: ledger[address] });
});

// Transfer CBDC
app.post('/transfer', (req, res) => {
    const { from, to, amount } = req.body;
    if (!ledger[from] || ledger[from] < amount) {
        return res.status(400).json({ success: false, message: "Insufficient balance" });
    }
    ledger[from] -= amount;
    if (!ledger[to]) ledger[to] = 0;
    ledger[to] += amount;
    res.json({ success: true, fromBalance: ledger[from], toBalance: ledger[to] });
});

// Get balance
app.get('/balance/:address', (req, res) => {
    const address = req.params.address;
    res.json({ address, balance: ledger[address] || 0 });
});

app.listen(port, () => {
    console.log(`CBDC dAPI running on http://localhost:${port}`);
});
