import { esUsuarioPro } from '../../lib/pro-store';

export default function handler(req, res) {
  const { email } = req.body;

  const isPro = esUsuarioPro(email);

  res.json({ pro: isPro });
}

