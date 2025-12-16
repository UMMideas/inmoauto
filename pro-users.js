const usuariosPro = [];

export function agregarUsuarioPro(email) {
  if (!usuariosPro.includes(email)) {
    usuariosPro.push(email);
  }
}

export default usuariosPro;
