import { esUsuarioPro } from '../lib/pro-store';

export default function handler(req, res) {
  const { email } = req.body;

  res.json({
    pro: esUsuarioPro(email)
  });
}

