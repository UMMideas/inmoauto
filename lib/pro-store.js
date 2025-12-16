let usuariosPro = [];

export function agregarUsuarioPro(email) {
  if (!usuariosPro.includes(email)) {
    usuariosPro.push(email);
  }
}

export function esUsuarioPro(email) {
  return usuariosPro.includes(email);
}
