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
- Operación: ${operacion}
- Tipo: ${propiedad}
- Ambientes: ${ambientes}
- Metros cuadrados: ${metros}
- Precio: ${precio}
- Barrio: ${barrio}
- Ciudad: ${ciudad}
- Objetivo del aviso: ${objetivo}

Reglas:
- Español neutro argentino
- Estilo profesional inmobiliario
- No exagerar
- 2 a 3 párrafos
- Cierre comercial sutil
`.trim();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Sos un experto en redacción inmobiliaria." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OPENAI ERROR:", errorText);
      throw new Error("Error en OpenAI");
    }

    const data = await response.json();
    const descripcion = data.choices[0].message.content;

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
