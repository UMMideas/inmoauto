/*
  server/send-email.js

  Example using Resend API for transactional email.
  Requires RESEND_API_KEY environment variable.
*/

const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { to, subject, html } = req.body;
  if (!process.env.RESEND_API_KEY) return res.status(500).json({ ok:false, error: 'No RESEND_API_KEY' });
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method:'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'INMOAUTO <no-reply@inmoauto.ai>',
        to: [to],
        subject,
        html
      })
    });
    const j = await r.json();
    return res.json({ ok:true, result: j });
  } catch(e){
    console.error(e);
    return res.status(500).json({ ok:false, error: e.message });
  }
};
