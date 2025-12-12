/*
  server/generate-description.js

  Example serverless function (Node.js) that receives form data and calls OpenAI.
  Deploy this file to Vercel under /api/generate-description

  Environment variables needed:
  - OPENAI_API_KEY

  This is a minimal example and must be adapted to your deployment.
*/

const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send({error: 'Only POST allowed'});
  try {
    const body = req.body;
    const prompt = `Actua como redactor inmobiliario senior en Argentina. Datos: ${JSON.stringify(body)}. Genera descripcion profesional (150-200 palabras), tecnica, emocional, titulo y bullets.`;
    const openaiResp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{role:'user', content: prompt}],
        max_tokens: 700
      })
    });
    const j = await openaiResp.json();
    const text = j.choices?.[0]?.message?.content || JSON.stringify(j);
    return res.json({ ok:true, text });
  } catch(e){
    console.error(e);
    return res.status(500).json({ok:false, error: e.message});
  }
};
