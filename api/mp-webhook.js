import mercadopago from 'mercadopago';
import fs from 'fs';
import path from 'path';

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

const USERS_FILE = path.join(process.cwd(), 'pro-users.json');

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

function saveUser(email) {
  const users = readUsers();
  if (!users.includes(email)) {
    users.push(email);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  }
}

export default async function handler(req, res) {
  try {
    const { type, data } = req.body;

    if (type !== 'payment') return res.status(200).end();

    const payment = await mercadopago.payment.findById(data.id);

    if (payment.body.status === 'approved') {
      const email = payment.body.payer.email;
      saveUser(email);
    }

    res.status(200).end();
  } catch (err) {
    console.error('Webhook MP error:', err);
    res.status(500).end();
  }
}

