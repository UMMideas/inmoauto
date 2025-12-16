import mercadopago from 'mercadopago';

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

export default async function handler(req, res) {
  const { email } = req.body;

  const preference = {
    items: [
      {
        title: 'Activación versión PRO',
        quantity: 1,
        currency_id: 'USD',
        unit_price: 10
      }
    ],
    payer: {
      email
    },
    metadata: {
      email
    },
    back_urls: {
      success: '/gracias',
      failure: '/',
      pending: '/'
    },
    auto_return: 'approved'
  };

  const response = await mercadopago.preferences.create(preference);

  res.json({
    init_point: response.body.init_point
  });
}
