import { activarUsuarioPro } from '../lib/pro-store';

export default async function handler(req, res) {
  try {
    const event = req.body;

    // Mercado Pago manda muchos eventos, filtramos
    if (event.type === 'payment') {
      const paymentId = event.data.id;

      // ⚠️ Ideal: consultar MP API para validar estado
      // MVP: asumimos pago aprobado (simplificado)

      const email = event.email || event.additional_info?.payer?.email;

      if (email) {
        activarUsuarioPro(email);
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Webhook error' });
  }
}

