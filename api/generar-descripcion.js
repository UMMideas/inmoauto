export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
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

    const prompt = `
Sos un redactor profesional inmobiliario en Argentina.
Redactá una descripción clara, atractiva y orientada a conversión.

Datos de la propiedad:
Operación: ${operacion}
Tipo: ${propiedad}
Ambientes: ${ambientes}
Metros: ${metros}
Precio: ${precio}
Barrio: ${barrio}
Ciudad: ${ciudad}
Objetivo del aviso: ${objetivo}

Reglas:
- Español argentino
- Estilo profesional inmobiliario
- 2 a 3 párrafos
- Sin emojis
- Cierre comercial sutil
`.trim();

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: prompt
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OPENAI ERROR:", err);
      throw new Error("Error en OpenAI");
    }

    const data = await response.json();
    const descripcion =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "No se pudo generar el texto";

    res.status(200).json({
      ok: true,
      descripcion
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}
