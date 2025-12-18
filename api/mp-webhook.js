import mercadopago from 'mercadopago';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

const USERS_FILE = path.join(process.cwd(), 'pro-users.json');

/* ======================
   STORE HELPERS
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
   PLANES (FUENTE ÚNICA)
====================== */

const PLANS = {
  pack_5: {
    credits: 5,
    expiresInDays: null
  },
  pack_10: {
    credits: 10,
    expiresInDays: null
  },
  mensual: {
    credits: 30,
    expiresInDays: 30
  }
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
   HANDLER WEBHOOK MP
====================== */

export default async function handler(req, res) {
  try {
    // 🔒 Seguridad
    if (!verifySignature(req)) {
      console.warn('❌ Webhook MP con firma inválida');
      return res.status(401).end();
    }

    const { type, data } = req.body;

    // MP envía muchos eventos
    if (type !== 'payment') {
      return res.status(200).end();
    }

    // 🔍 Obtener pago real
    const payment = await mercadopago.payment.findById(data.id);
    const info = payment.body;

    // ✅ Solo pagos aprobados
    if (info.status !== 'approved') {
      return res.status(200).end();
    }

    const email = info.payer?.email;
    const planId = info.metadata?.plan_id;
    const paymentId = String(info.id);

    if (!email || !planId || !PLANS[planId]) {
      console.warn('⚠️ Pago aprobado sin metadata válida');
      return res.status(200).end();
    }

    const store = readStore();

    /* ======================
       CREAR USUARIO SI NO EXISTE
    ====================== */

    if (!store.users[email]) {
      store.users[email] = {
        plan: planId,
        credits: 0,
        expiresAt: null,
        payments: []
      };
    }

    const user = store.users[email];

    /* ======================
       ANTI DUPLICADOS REAL
    ====================== */

    if (user.payments.includes(paymentId)) {
      return res.status(200).end();
    }

    const plan = PLANS[planId];

    /* ======================
       CARGA DE CRÉDITOS
    ====================== */

    user.credits += plan.credits;
    user.plan = planId;

    /* ======================
       PLAN MENSUAL (RENOVABLE)
    ====================== */

    if (plan.expiresInDays) {
      const now = new Date();

      // Si ya tenía plan activo, renovamos desde hoy
      const baseDate =
        user.expiresAt && new Date(user.expiresAt) > now
          ? new Date(user.expiresAt)
          : now;

      baseDate.setDate(baseDate.getDate() + plan.expiresInDays);
      user.expiresAt = baseDate.toISOString();
    }

    /* ======================
       REGISTRAR PAGO
    ====================== */

    user.payments.push(paymentId);

    writeStore(store);

    console.log(`✅ PRO activado: ${email} → ${planId}`);

    return res.status(200).end();

  } catch (err) {
    console.error('❌ mp-webhook error:', err);
    return res.status(500).end();
  }
}
