import mercadopago from 'mercadopago';

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email requerido' });
    }

    if (!process.env.MP_ACCESS_TOKEN) {
      return res.status(500).json({ error: 'MP_ACCESS_TOKEN no configurado' });
    }

    const preference = {
      items: [
        {
          title: 'Activación versión PRO — INMOAUTO',
          quantity: 1,
          currency_id: 'ARS', // 👈 CLAVE
          unit_price: 10000   // ARS (ej: $10.000)
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
      metadata: {
        email
      }
    };

    const response = await mercadopago.preferences.create(preference);

    return res.status(200).json({
      init_point: response.body.init_point
    });

  } catch (error) {
    console.error('❌ Error creando preferencia MP:', error);

    return res.status(500).json({
      error: 'No se pudo crear la preferencia de pago'
    });
  }
}
