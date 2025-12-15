export const config = {
  runtime: "nodejs"
};

// 🔥 FLAG CENTRAL
const DEMO_MODE = true;

function generarDescripcionDemo(data) {
  const {
    operacion,
    propiedad,
    ambientes,
    metros,
    precio,
    barrio,
    ciudad,
    objetivo
  } = data;

  const tipoOperacion =
    operacion?.toLowerCase() === "venta" ? "en venta" : "en alquiler";

  const perfil =
    objetivo === "premium"
      ? "ideal para un perfil exigente que busca calidad y ubicación"
      : "ideal tanto para vivienda como para inversión";

  return `
${propiedad} ${tipoOperacion} ubicada en ${barrio}, ${ciudad}.
Cuenta con ${ambientes} ambientes y una superficie aproximada de ${metros} m², con una distribución funcional y buena luminosidad.
${perfil}.
Valor de referencia: USD ${precio}.
`.trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  try {
    // 🟢 MODO DEMO
    if (DEMO_MODE) {
      const descripcion = generarDescripcionDemo(req.body);

      return res.status(200).json({
        ok: true,
        descripcion,
        demo: true
      });
    }

    // 🔵 FUTURO: IA REAL (NO TOCAR)
    return res.status(500).json({ ok: false });

  } catch (error) {
    console.error("DEMO ERROR:", error);
    return res.status(500).json({ ok: false });
  }
}
