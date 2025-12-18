document.addEventListener('DOMContentLoaded', () => {

  const btnPro = document.getElementById('btn-pro');
  const proResult = document.getElementById('pro-result');
  const proPay = document.getElementById('pro-pay');
  const proNotice = document.getElementById('pro-notice');
  const proCredits = document.getElementById('pro-credits');
  const btnPayPro = document.getElementById('btn-pay-pro');

  let forcedPlan = null; // 👈 C10.7

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
      forcedPlan = null;

      const form = document.getElementById('wizardForm');
      const data = Object.fromEntries(new FormData(form));
      const email = data.email;

      if (!email) {
        alert('Ingresá un email');
        return;
      }

      const check = await checkPro(email);

      /* ======================
         ❌ BLOQUEOS PRO
      ====================== */

      if (!check.pro) {
        proResult.style.display = 'block';
        proPay.style.display = 'block';

        proCredits.style.display = 'none';

        if (check.reason === 'no_credits') {
          proNotice.innerHTML =
            '⚠️ Te quedaste sin créditos.<br><small>Pasate al plan mensual y seguí generando sin límites.</small>';
          forcedPlan = 'mensual';
        }

        if (check.reason === 'expired') {
          proNotice.innerHTML =
            '⏳ Tu plan mensual venció.<br><small>Reactivá tu plan para seguir usando INMOAUTO.</small>';
          forcedPlan = 'mensual';
        }

        if (!check.reason) {
          proNotice.innerHTML =
            '🔒 Función disponible solo para usuarios PRO.';
          forcedPlan = 'pack_10';
        }

        proNotice.style.display = 'block';
        mostrarPlanesMensuales();
        return;
      }

      /* ======================
         ✅ PRO OK
      ====================== */

      btnPro.textContent = 'Generando versión PRO...';

      const json = await generarVersionPro(data);

      proNotice.innerHTML =
        '✅ Versión PRO generada correctamente';
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
        forcedPlan = 'mensual';
        mostrarPlanesMensuales();
      }

      alert('No se pudo generar la versión PRO');
    } finally {
      btnPro.textContent = 'Obtener versión PRO';
      btnPro.disabled = false;
    }
  });

  /* ======================
     🚀 ACTIVAR PRO (MP)
  ====================== */

  btnPayPro?.addEventListener('click', async () => {
    try {
      const form = document.getElementById('wizardForm');
      const data = Object.fromEntries(new FormData(form));
      const email = data.email;

      if (!email) {
        alert('Necesitamos tu email para continuar');
        return;
      }

      btnPayPro.textContent = 'Redirigiendo a Mercado Pago...';
      btnPayPro.disabled = true;

      const plan = forcedPlan || 'pack_10';

      const res = await fetch('/api/create-mp-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plan })
      });

      const json = await res.json();

      if (!json.init_point) {
        throw new Error('No se pudo iniciar el pago');
      }

      window.location.href = json.init_point;

    } catch (err) {
      console.error(err);
      alert('Error al iniciar el pago');
    } finally {
      btnPayPro.textContent = '🚀 Activar versión PRO';
      btnPayPro.disabled = false;
    }
  });

});
