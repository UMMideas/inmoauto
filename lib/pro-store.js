// MVP simple (luego DB)
let usuariosPro = new Set();

export function activarUsuarioPro(email) {
  usuariosPro.add(email);
  console.log('Usuario PRO activado:', email);
}

export function esUsuarioPro(email) {
  return usuariosPro.has(email);
}
