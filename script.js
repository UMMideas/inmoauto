import { checkProStatus } from './check-pro.js';

const form = document.getElementById('wizardForm');
const result = document.getElementById('result');
const proCTA = document.getElementById('pro-cta');

let freeCredits = 1;

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const isPro = await checkProStatus();

  if (!isPro && freeCredits <= 0) {
    result.textContent = '';
    proCTA.style.display = 'block';
    return;
  }

  result.textContent = '⏳ Generando descripción...';

  // simulación IA FREE
  setTimeout(() => {
    if (!isPro) freeCredits--;

    result.textContent = `
Departamento en excelente ubicación.
Ideal para ${form.operacion.value.toLowerCase()}.
Ambientes: ${form.ambientes.value || '—'}
Superficie: ${form.metros.value || '—'} m²
Precio: ${form.precio.value || 'consultar'}
    `.trim();

    if (!isPro && freeCredits <= 0) {
      proCTA.style.display = 'block';
    }
  }, 1200);
});
