import fetch from "node-fetch";

export const config = {
  runtime: "nodejs"
};

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

Datos:
Operación: ${operacion}
Tipo: ${propiedad}
Ambientes: ${ambientes}
Metros: ${metros}
Precio: ${precio}
Barrio: ${barrio}
Ciudad: ${ciudad}
Objetivo: ${objetivo}
`.trim();

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: prompt
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OPENAI ERROR:", data);
      return res.status(500).json({ ok: false });
    }

    const descripcion =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text;

    res.status(200).json({ ok: true, descripcion });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ ok: false });
  }
}
