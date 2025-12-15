export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { titulo, barrio, precio } = req.body;

  res.status(200).json({
    ok: true,
    descripcion: `Propiedad ${titulo} ubicada en ${barrio}, con un valor de ${precio}.`
  });
}
