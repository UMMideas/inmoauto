import mercadopago from 'mercadopago';
import { agregarUsuarioPro } from '../../lib/pro-store';

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

export default async function handler(req, res) {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;

      const payment = await mercadopago.payment.findById(paymentId);

      if (payment.body.status === 'approved') {
        const email = payment.body.payer.email;

        if (email) {
          await agregarUsuarioPro(email);
        }
      }
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
}

