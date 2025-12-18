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
      return res.json({
        pro: false,
        reason: 'no_email',
        message: 'Ingresá un email para continuar'
      });
    }

    const data = readUsers();
    const user = data.users[email];

    // ❌ No existe
    if (!user) {
      return res.json({
        pro: false,
        reason: 'not_pro',
        message: 'Este contenido está disponible solo para usuarios PRO'
      });
    }

    // ⏳ Plan mensual vencido
    if (user.expiresAt) {
      const now = new Date();
      const expires = new Date(user.expiresAt);

      if (now > expires) {
        return res.json({
          pro: false,
          reason: 'expired',
          message: 'Tu plan PRO venció. Renovalo para seguir usando la versión PRO'
        });
      }
    }

    // 🔢 Sin créditos
    if (user.credits <= 0) {
      return res.json({
        pro: false,
        reason: 'no_credits',
        message: 'Te quedaste sin créditos PRO. Elegí un plan para seguir generando'
      });
    }

    // ✅ OK
    return res.json({
      pro: true,
      plan: user.plan,
      credits_left: user.credits
    });

  } catch (err) {
    console.error('check-pro error:', err);
    return res.status(500).json({
      pro: false,
      reason: 'server_error',
      message: 'Error al verificar el estado PRO'
    });
  }
}
