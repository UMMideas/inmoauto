import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'pro-users.json');

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    return { users: {} };
  }

  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

export default function handler(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ pro: false });
    }

    const data = readUsers();
    const user = data.users[email];

    // ❌ No existe
    if (!user) {
      return res.json({ pro: false });
    }

    // ⏳ Plan mensual → validar vencimiento
    if (user.expiresAt) {
      const now = new Date();
      const expires = new Date(user.expiresAt);

      if (now > expires) {
        return res.json({ pro: false, reason: 'expired' });
      }
    }

    // 🔢 Sin créditos
    if (user.credits <= 0) {
      return res.json({ pro: false, reason: 'no_credits' });
    }

    // ✅ OK
    return res.json({
      pro: true,
      plan: user.plan,
      credits_left: user.credits // 🔑 CLAVE
    });

  } catch (err) {
    console.error('check-pro error:', err);
    res.status(500).json({ pro: false });
  }
}
