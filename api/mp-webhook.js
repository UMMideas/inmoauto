import mercadopago from 'mercadopago';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

const USERS_FILE = path.join(process.cwd(), 'pro-users.json');

/* ======================
   HELPERS USUARIOS PRO
====================== */

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

/* ======================
   VERIFICAR FIRMA WEBHOOK
====================== */

function verifySignature(req) {
  const signature = req.headers['x-signature'];
  const requestId = req.headers['x-request-id'];

  if (!signature || !requestId) return false;

  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return false;

  const manifest = `id:${requestId};request-id:${requestId};`;

  const hash = crypto
    .createHmac('sha256', secret)
    .update(manifest)
    .digest('hex');

  return signature === hash;
}

/* ======================
   HANDLER WEBHOOK MP
====================== */

export default async function handler(req, res) {
  try {
    // 🔒 1️⃣ Validar firma
    if (!verifySignature(req)) {
      console.warn('❌ Webhook MP con firma inválida');
      return res.status(401).end();
    }

    const { type, data } = req.body;

    // MP envía muchos eventos, solo nos interesa payment
    if (type !== 'payment') {
      return res.status(200).end();
    }

    // 🔍 Obtener pago real desde MP
    const payment = await mercadopago.payment.findById(data.id);

    // ✅ Solo pagos aprobados
    if (payment.body.status === 'approved') {
      const email = payment.body.payer?.email;

      if (email) {
        saveUser(email);
        console.log('✅ Usuario PRO activado:', email);
      }
    }

    return res.status(200).end();

  } catch (err) {
    console.error('❌ Webhook MP error:', err);
    return res.status(500).end();
  }
}
