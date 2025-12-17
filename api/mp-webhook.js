import mercadopago from 'mercadopago';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

const USERS_FILE = path.join(process.cwd(), 'pro-users.json');

/* ======================
   HELPERS STORE
====================== */

function readStore() {
  if (!fs.existsSync(USERS_FILE)) {
    return { users: {} };
  }
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

function writeStore(data) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
}

/* ======================
   PLANES (FUENTE DE VERDAD)
====================== */

const PLANS = {
  pack_5: { credits: 5, expiresInDays: null },
  pack_10: { credits: 10, expiresInDays: null },
  mensual: { credits: 30, expiresInDays: 30 }
};

/* ======================
   VERIFICAR FIRMA MP
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
   HANDLER
====================== */

export default async function handler(req, res) {
  try {
    if (!verifySignature(req)) {
      console.warn('❌ Firma MP inválida');
      return res.status(401).end();
    }

    const { type, data } = req.body;
    if (type !== 'payment') return res.status(200).end();

    const payment = await mercadopago.payment.findById(data.id);
    const info = payment.body;

    if (info.status !== 'approved') return res.status(200).end();

    const email = info.payer?.email;
    const planId = info.metadata?.plan_id;
    const paymentId = info.id?.toString();

    if (!email || !planId || !PLANS[planId]) {
      console.warn('⚠️ Pago aprobado sin metadata válida');
      return res.status(200).end();
    }

    const store = readStore();

    if (!store.users[email]) {
      store.users[email] = {
        plan: planId,
        credits: 0,
        expiresAt: null,
        payments: []
      };
    }

    // 🔒 Anti-duplicados
    if (store.users[email].payments.includes(paymentId)) {
      return res.status(200).end();
    }

    const plan = PLANS[planId];

    store.users[email].credits += plan.credits;

    if (plan.expiresInDays) {
      const expires = new Date();
      expires.setDate(expires.getDate() + plan.expiresInDays);
      store.users[email].expiresAt = expires.toISOString();
    }

    store.users[email].payments.push(paymentId);

    writeStore(store);

    console.log(`✅ Créditos cargados: ${email} → ${planId}`);

    return res.status(200).end();

  } catch (err) {
    console.error('❌ mp-webhook error:', err);
    return res.status(500).end();
  }
}
