import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'pro-users.json');

export default function handler(req, res) {
  const { email } = req.body;

  if (!fs.existsSync(USERS_FILE)) {
    return res.json({ pro: false });
  }

  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  res.json({ pro: users.includes(email) });
}
