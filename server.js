// Backend for MUCHBE TRADING CBDC Web3 Wallet

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Web3 = require('web3');
const { v4: uuidv4 } = require('uuid');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Web3 and Ethereum setup
const web3 = new Web3("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID");

// Twilio setup
const twilioClient = twilio('YOUR_TWILIO_SID', 'YOUR_TWILIO_AUTH_TOKEN');
const TWILIO_NUMBER = 'whatsapp:+14155238886';

// In-memory store (replace with DB in production)
const users = {};

function createAccount(name, phone, type) {
  const wallet = web3.eth.accounts.create();
  const account = {
    id: uuidv4(),
    name,
    phone,
    address: wallet.address,
    privateKey: wallet.privateKey,
    balance: type === 'business' ? 100000 : 1000,
    type
  };
  users[account.address] = account;
  return account;
}

function sendWhatsApp(to, message) {
  return twilioClient.messages.create({
    body: message,
    from: TWILIO_NUMBER,
    to: `whatsapp:${to}`
  });
}

// Routes
app.post('/register', async (req, res) => {
  const { name, phone, type } = req.body;
  if (!name || !phone || !type) return res.status(400).send("Missing fields");

  const account = createAccount(name, phone, type);
  await sendWhatsApp(phone, `Hello ${name}, your MUCHBE CBDC wallet was created. Your account number: ${account.address}. Balance: ZAR ${account.balance}`);

  res.json({
    message: "Account created successfully",
    account: {
      name: account.name,
      address: account.address,
      balance: account.balance,
      type: account.type
    }
  });
});

app.post('/login', (req, res) => {
  const { address } = req.body;
  if (!users[address]) return res.status(404).send("Account not found");
  res.json(users[address]);
});

app.post('/transfer', (req, res) => {
  const { from, to, amount } = req.body;
  const sender = users[from];
  const recipient = users[to];
  if (!sender || !recipient) return res.status(400).send("Invalid accounts");
  if (sender.balance < amount) return res.status(400).send("Insufficient funds");

  sender.balance -= amount;
  recipient.balance += amount;

  sendWhatsApp(sender.phone, `You sent ZAR ${amount} to ${recipient.name} (${recipient.address}). Remaining balance: ZAR ${sender.balance}`);
  sendWhatsApp(recipient.phone, `You received ZAR ${amount} from ${sender.name} (${sender.address}). New balance: ZAR ${recipient.balance}`);

  res.send("Transfer successful");
});

app.listen(3000, () => console.log('CBDC Web3 backend running on port 3000'));

