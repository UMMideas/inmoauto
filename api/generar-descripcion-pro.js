import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'pro-users.json');

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    return { users: {} };
  }
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

function writeUsers(data) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
}

export default async function handler(req, res) {
  try {
    const data = req.body;
    const email = data.email;

    if (!email) {
      return res.status(401).json({
        error: 'Email requerido',
        reason: 'no_email'
      });
    }

    const store = readUsers();
    const user = store.users[email];

    // ❌ No PRO
    if (!user) {
      return res.status(403).json({
        error: 'Usuario no PRO',
        reason: 'not_pro'
      });
    }

    // ⏳ Expirado
    if (user.expiresAt && new Date() > new Date(user.expiresAt)) {
      return res.status(403).json({
        error: 'Plan expirado',
        reason: 'expired'
      });
    }

    // 🔢 Sin créditos
    if (user.credits <= 0) {
      return res.status(403).json({
        error: 'Sin créditos disponibles',
        reason: 'no_credits'
      });
    }

    /* ======================
       GENERACIÓN (mock IA)
    ====================== */

    const variantes = {
      clasica: `Descripción clásica PRO para ${data.propiedad} en ${data.barrio}.`,
      premium: `Descripción premium PRO destacando valor y exclusividad.`,
      inversion: `Descripción orientada a inversores con foco en rentabilidad.`
    };

    const copy = {
      whatsapp: '📲 Consultanos ahora por esta propiedad única.',
      instagram: '🏡 Una oportunidad que no se publica todos los días.',
      portal: 'Propiedad destacada con excelente proyección.'
    };

    /* ======================
       DESCONTAR CRÉDITO
    ====================== */

    user.credits -= 1;
    store.users[email] = user;
    writeUsers(store);

    return res.json({
      variantes,
      copy,
      credits_left: user.credits
    });

  } catch (err) {
    console.error('generar-descripcion-pro error:', err);
    return res.status(500).json({
      error: 'Error generando versión PRO',
      reason: 'server_error'
    });
  }
}
