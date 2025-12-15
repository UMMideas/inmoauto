import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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
- No usar emojis
- No exagerar
- 2 a 3 párrafos
- Cerrar con una frase comercial sutil
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Sos un experto en redacción inmobiliaria." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    const descripcion = completion.choices[0].message.content;

    res.status(200).json({
      ok: true,
      descripcion
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error: "Error generando la descripción"
    });
  }
}
