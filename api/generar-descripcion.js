export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const {
    operacion,
    propiedad,
    ambientes,
    metros,
    precio,
    barrio,
    ciudad,
    objetivo
  } = req.body;

  const descripcion = `
${propiedad} en ${operacion.toLowerCase()} ubicada en ${barrio}, ${ciudad}.
Cuenta con ${ambientes || 'varios'} ambientes y ${metros || '—'} m².
Ideal para ${objetivo?.toLowerCase() || 'vivir o invertir'}.
Valor: ${precio}.
`.trim();

  res.status(200).json({
    ok: true,
    descripcion
  });
}
