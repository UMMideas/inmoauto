import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

/* ======================
   PLANES (FUENTE ÚNICA)
====================== */

const PLANS = {
  pack_5: {
    title: 'Pack 5 créditos PRO — INMOAUTO',
    price: 6000,
    credits: 5
  },
  pack_10: {
    title: 'Pack 10 créditos PRO — INMOAUTO',
    price: 10000,
    credits: 10
  },
  mensual: {
    title: 'Plan mensual PRO — INMOAUTO',
    price: 18000,
    credits: 30
  }
};

/* ======================
   HANDLER
====================== */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, plan } = req.body;

    if (!email || !plan) {
      return res.status(400).json({ error: 'Email y plan requeridos' });
    }

    const selectedPlan = PLANS[plan];

    if (!selectedPlan) {
      return res.status(400).json({ error: 'Plan inválido' });
    }

    if (!process.env.MP_ACCESS_TOKEN) {
      return res.status(500).json({ error: 'MP_ACCESS_TOKEN no configurado' });
    }

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            title: selectedPlan.title,
            quantity: 1,
            currency_id: 'ARS',
            unit_price: selectedPlan.price
          }
        ],
        payer: {
          email
        },
        back_urls: {
          success: 'https://inmoauto.vercel.app/gracias',
          failure: 'https://inmoauto.vercel.app/',
          pending: 'https://inmoauto.vercel.app/'
        },
        auto_return: 'approved',

        /* 🔑 CLAVE DEL SISTEMA */
        metadata: {
          email,
          plan_id: plan
        }
      }
    });

    return res.status(200).json({
      init_point: response.init_point
    });

  } catch (error) {
    console.error('❌ Error Mercado Pago:', error);

    return res.status(500).json({
      error: 'No se pudo crear la preferencia'
    });
  }
}
