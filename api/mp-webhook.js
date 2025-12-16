export default async function handler(req, res) {
  const payment = req.body;

  if (payment?.data?.id) {
    // 1. Consultar pago a MP
    // 2. Verificar status === approved
    // 3. Guardar email como PRO
  }

  res.status(200).send("OK");
}
