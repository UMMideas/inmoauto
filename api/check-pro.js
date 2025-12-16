// /api/check-pro.js
import usuariosPro from '../pro-users';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false });
  }

  const { email } = req.body;

  const isPro = usuariosPro.includes(email);

  res.status(200).json({
    ok: true,
    pro: isPro
  });
}
