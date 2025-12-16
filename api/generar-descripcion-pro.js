import { esUsuarioPro } from '../lib/pro-store';

export default async function handler(req, res) {
  try {
    const data = req.body;
    const email = data.email;

    if (!email) {
      return res.status(400).json({ error: 'Email requerido' });
    }

    // 🔐 Chequeo PRO
    const isPro = esUsuarioPro(email);

    if (!isPro) {
      return res.status(403).json({
        error: 'Usuario no PRO'
      });
    }

    // ⚙️ Simulación IA PRO (por ahora)
    const descripcionBase = `
PH en venta ubicada en ${data.zona}, ${data.ciudad}.
Cuenta con ${data.ambientes} ambientes y una superficie aproximada de ${data.superficie} m².
Ideal tanto para vivienda como para inversión.
    `.trim();

    res.json({
      variantes: {
        clasica: descripcionBase,
        premium: descripcionBase + '\n\nTerminaciones de calidad y excelente proyección.',
        inversion: descripcionBase + '\n\nAlta rentabilidad y demanda sostenida.'
      },
      copy: {
        whatsapp: '📲 Consultanos hoy y coordiná una visita.',
        instagram: '🏡 Una oportunidad única que no se repite.',
        portal: 'Propiedad ideal para quienes buscan ubicación y funcionalidad.'
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error procesando versión PRO' });
  }
}

