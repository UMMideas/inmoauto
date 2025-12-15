export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false });
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

  // ⚠️ MODO PRO DEMO (sin OpenAI todavía)
  // Esto luego se reemplaza por IA real

  const base = `${propiedad} en ${operacion.toLowerCase()} ubicada en ${barrio}, ${ciudad}.
Cuenta con ${ambientes} ambientes y ${metros} m².
Valor de referencia: USD ${precio}.`;

  const variantes = {
    clasica: `${base}
Una opción sólida para quienes buscan una propiedad funcional y bien ubicada.`,

    premium: `${base}
Destaca por su calidad constructiva, entorno y potencial para un público exigente.`,

    inversion: `${base}
Excelente oportunidad de inversión por su ubicación y proyección de renta.`
  };

  const copy = {
    whatsapp: `🏡 ${propiedad} en ${barrio}
${ambientes} amb • ${metros} m²
USD ${precio}
📲 Consultanos para más info`,

    instagram: `🏡 NUEVO INGRESO
${propiedad} en ${barrio}, ${ciudad}
${ambientes} ambientes · ${metros} m²
Ideal para ${objetivo.toLowerCase()}
📩 Escribinos por DM`,

    portal: `${propiedad} en ${operacion} en ${barrio}, ${ciudad}. ${ambientes} ambientes, ${metros} m². Valor USD ${precio}.`
  };

  return res.status(200).json({
    ok: true,
    pro: true,
    variantes,
    copy
  });
}
