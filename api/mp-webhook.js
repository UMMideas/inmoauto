import mercadopago from "mercadopago";
import { agregarUsuarioPro } from "../pro-users";

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

export default async function handler(req, res) {
  try {
    const { type, data } = req.body;

    // MP envía muchos eventos → solo nos importa payment
    if (type !== "payment") {
      return res.status(200).send("Evento ignorado");
    }

    const paymentId = data.id;

    const payment = await mercadopago.payment.findById(paymentId);

    if (payment.body.status === "approved") {
      const email = payment.body.payer.email;

      if (email) {
        agregarUsuarioPro(email.toLowerCase());
        console.log("Usuario PRO activado:", email);
      }
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("MP Webhook error:", err);
    res.status(500).send("Webhook error");
  }
}
