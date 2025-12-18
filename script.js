document.addEventListener('DOMContentLoaded', () => {

  const btnPro = document.getElementById('btn-pro');
  const proResult = document.getElementById('pro-result');
  const proPay = document.getElementById('pro-pay');
  const proNotice = document.getElementById('pro-notice');
  const proCredits = document.getElementById('pro-credits');

  async function checkPro(email) {
    const res = await fetch('/api/check-pro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.json();
  }

  async function generarVersionPro(data) {
    const res = await fetch('/api/generar-descripcion-pro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json();
      throw err;
    }

    return res.json();
  }

  function mostrarPlanesMensuales() {
    document.getElementById('planes-pro')
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  btnPro?.addEventListener('click', async () => {
    try {
      btnPro.textContent = 'Verificando acceso...';
      btnPro.disabled = true;

      const form = document.getElementById('wizardForm');
      const data = Object.fromEntries(new FormData(form));
      const email = data.email;

      if (!email) {
        alert('Ingresá un email');
        return;
      }

      const check = await checkPro(email);

      // ❌ NO PRO / BLOQUEOS
      if (!check.pro) {
        proResult.style.display = 'block';
        proPay.style.display = 'block';

        proNotice.textContent = check.message;
        proNotice.style.display = 'block';

        if (check.reason === 'no_credits' || check.reason === 'expired') {
          mostrarPlanesMensuales();
        }

        return;
      }

      // ✅ PRO OK
      btnPro.textContent = 'Generando versión PRO...';

      const json = await generarVersionPro(data);

      proNotice.textContent = '✅ Versión PRO generada correctamente';
      proNotice.style.display = 'block';

      proCredits.textContent =
        `✨ Créditos disponibles: ${json.credits_left}`;
      proCredits.style.display = 'block';

      proResult.style.display = 'block';
      proPay.style.display = 'none';

      document.getElementById('pro-text').textContent =
        json.variantes.clasica;

      document.getElementById('copy-whatsapp').textContent =
        json.copy.whatsapp;

      document.getElementById('copy-instagram').textContent =
        json.copy.instagram;

      document.getElementById('copy-portal').textContent =
        json.copy.portal;

      window.__proVariantes = json.variantes;

    } catch (err) {
      console.error(err);
      if (err.reason === 'no_credits' || err.reason === 'expired') {
        mostrarPlanesMensuales();
      }
      alert('No se pudo generar la versión PRO');
    } finally {
      btnPro.textContent = 'Obtener versión PRO';
      btnPro.disabled = false;
    }
  });

});
