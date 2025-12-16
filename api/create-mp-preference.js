import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

export default async function handler(req, res) {
  const { email } = req.body;

  const preference = {
    items: [
      {
        title: "INMOAUTO PRO - Plan Mensual",
        quantity: 1,
        currency_id: "ARS",
        unit_price: 9900
      }
    ],
    payer: {
      email
    },
    back_urls: {
      success: "https://inmoauto.com/success",
      failure: "https://inmoauto.com/failure",
      pending: "https://inmoauto.com/pending"
    },
    auto_return: "approved"
  };

  const response = await mercadopago.preferences.create(preference);

  res.status(200).json({
    init_point: response.body.init_point
  });
}
