document.addEventListener('DOMContentLoaded', () => {

  /* ======================
     WIZARD
  ====================== */

  const steps = document.querySelectorAll('.step');
  const stepIndicators = document.querySelectorAll('.wizard-steps li');
  let current = 0;

  function updateSteps() {
    steps.forEach((s, i) => s.classList.toggle('active', i === current));
    stepIndicators.forEach((l, i) =>
      l.classList.toggle('active', i === current)
    );
  }

  document.addEventListener('click', e => {
    if (e.target.classList.contains('next') && current < steps.length - 1) {
      current++;
      updateSteps();
    }

    if (e.target.classList.contains('prev') && current > 0) {
      current--;
      updateSteps();
    }
  });

  /* ======================
     SUBMIT DEMO
  ====================== */

  const form = document.getElementById('wizardForm');
  const result = document.getElementById('result');
  const proCTA = document.getElementById('pro-cta');

  form?.addEventListener('submit', async e => {
    e.preventDefault();

    result.textContent = 'Generando descripción con IA...';
    proCTA && (proCTA.style.display = 'none');

    try {
      const data = Object.fromEntries(new FormData(form));

      const res = await fetch('/api/generar-descripcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const json = await res.json();

      result.textContent =
        json.descripcion || 'No se pudo generar la descripción.';

      if (json.demo === true && proCTA) {
        proCTA.style.display = 'block';
      }

    } catch (err) {
      console.error(err);
      result.textContent = 'Error al generar la descripción.';
    }
  });
});

/* ======================
   HELPERS
====================== */

async function generarVersionPro(data) {
  const res = await fetch('/api/generar-descripcion-pro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error('Error generando versión PRO');
  return res.json();
}

async function checkPro(email) {
  const res = await fetch('/api/check-pro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  return res.json();
}

/* ======================
   BOTÓN PRO (CONTROLADO)
====================== */

const btnPro = document.getElementById('btn-pro');
const proResult = document.getElementById('pro-result');
const proPay = document.getElementById('pro-pay');

btnPro?.addEventListener('click', async () => {
  try {
    btnPro.textContent = 'Verificando acceso...';
    btnPro.disabled = true;

    const form = document.getElementById('wizardForm');
    const data = Object.fromEntries(new FormData(form));

    if (!data.email) {
      alert('Por favor ingresá un email');
      return;
    }

    // 1️⃣ Chequear PRO
    const check = await checkPro(data.email);

    // 2️⃣ NO ES PRO → mostrar pago
    if (!check.pro) {
      proResult.style.display = 'block';
      proPay.style.display = 'block';
      return;
    }

    // 3️⃣ ES PRO → generar contenido
    btnPro.textContent = 'Generando versión PRO...';

    const json = await generarVersionPro(data);

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
    alert('Error al procesar versión PRO');
  } finally {
    btnPro.textContent = 'Obtener versión PRO';
    btnPro.disabled = false;
  }
});

/* ======================
   TABS PRO
====================== */

document.addEventListener('click', e => {
  if (!e.target.classList.contains('tab')) return;

  document.querySelectorAll('.tab').forEach(t =>
    t.classList.remove('active')
  );

  e.target.classList.add('active');

  const tipo = e.target.dataset.tab;

  if (window.__proVariantes?.[tipo]) {
    document.getElementById('pro-text').textContent =
      window.__proVariantes[tipo];
  }
});

/* ======================
   COPIAR TEXTO PRO
====================== */

const btnCopyText = document.getElementById('btn-copy-text');

btnCopyText?.addEventListener('click', async () => {
  try {
    const texto = `
DESCRIPCIÓN
-----------
${document.getElementById('pro-text').textContent}

WHATSAPP
--------
${document.getElementById('copy-whatsapp').textContent}

INSTAGRAM
---------
${document.getElementById('copy-instagram').textContent}

PORTAL
------
${document.getElementById('copy-portal').textContent}
    `.trim();

    await navigator.clipboard.writeText(texto);

    btnCopyText.textContent = '✅ Copiado';
    setTimeout(() => {
      btnCopyText.textContent = '📋 Copiar texto';
    }, 2000);

  } catch (err) {
    console.error(err);
    alert('No se pudo copiar el texto');
  }
});

/* ======================
   EXPORTAR PDF
====================== */

const btnExportPDF = document.getElementById('btn-export-pdf');

btnExportPDF?.addEventListener('click', async () => {
  try {
    btnExportPDF.textContent = 'Generando PDF...';
    btnExportPDF.disabled = true;

    const payload = {
      descripcion: document.getElementById('pro-text').textContent,
      copy: {
        whatsapp: document.getElementById('copy-whatsapp').textContent,
        instagram: document.getElementById('copy-instagram').textContent,
        portal: document.getElementById('copy-portal').textContent
      }
    };

    const res = await fetch('/api/exportar-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'descripcion-pro.pdf';
    a.click();

    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error(err);
    alert('No se pudo generar el PDF');
  } finally {
    btnExportPDF.textContent = '📄 Exportar PDF';
    btnExportPDF.disabled = false;
  }
});

/* ======================
   BOTÓN ACTIVAR PRO (MP)
====================== */

document.addEventListener('click', async e => {
  if (e.target?.id !== 'btn-pay-pro') return;

  try {
    const form = document.getElementById('wizardForm');
    const data = Object.fromEntries(new FormData(form));

    if (!data.email) {
      alert('Email requerido para el pago');
      return;
    }

    e.target.textContent = 'Redirigiendo a pago...';
    e.target.disabled = true;

    const res = await fetch('/api/create-mp-preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email })
    });

    const json = await res.json();

    if (json.init_point) {
      window.location.href = json.init_point;
    } else {
      throw new Error('init_point no recibido');
    }

  } catch (err) {
    console.error(err);
    e.target.textContent = '🚀 Activar versión PRO';
    e.target.disabled = false;
  }
});

