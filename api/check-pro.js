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

    if (!user) {
      return res.json({
        pro: false,
        reason: 'not_pro',
        message: 'Este contenido está disponible solo para usuarios PRO'
      });
    }

    /* ======================
       ⏳ PLAN MENSUAL
    ====================== */

    let expiresSoon = false;

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

      const diffHours = (expires - now) / (1000 * 60 * 60);
      if (diffHours <= 72) {
        expiresSoon = true;
      }
    }

    /* ======================
       🔢 CRÉDITOS
    ====================== */

    if (user.credits <= 0) {
      return res.json({
        pro: false,
        reason: 'no_credits',
        message: 'Te quedaste sin créditos PRO. Elegí un plan para seguir generando'
      });
    }

    const lowCredits = user.credits <= 3;

    /* ======================
       ✅ PRO OK
    ====================== */

    return res.json({
      pro: true,
      plan: user.plan,
      credits_left: user.credits,
      warnings: {
        lowCredits,
        expiresSoon
      }
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
