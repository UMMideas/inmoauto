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
    if (e.target.classList.contains('next')) {
      if (current < steps.length - 1) {
        current++;
        updateSteps();
      }
    }

    if (e.target.classList.contains('prev')) {
      if (current > 0) {
        current--;
        updateSteps();
      }
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
    if (proCTA) proCTA.style.display = 'none';

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

  /* ======================
     MODAL PRO (EMAIL)
     ⚠️ NO se abre automáticamente
  ====================== */

  const proModal = document.getElementById('pro-modal');
  const closePro = document.getElementById('close-pro');
  const proForm = document.getElementById('pro-lead-form');
  const proSuccess = document.getElementById('pro-success');

  closePro?.addEventListener('click', () => {
    proModal.style.display = 'none';
  });

  proModal?.addEventListener('click', e => {
    if (e.target === proModal) {
      proModal.style.display = 'none';
    }
  });

  proForm?.addEventListener('submit', e => {
    e.preventDefault();

    const email = new FormData(proForm).get('email');
    console.log('Lead PRO:', email);

    proForm.style.display = 'none';
    proSuccess.style.display = 'block';
  });

  /*
  ==================================================
  🚫 LISTENER DESACTIVADO (INTENCIONALMENTE)
  --------------------------------------------------
  Este listener abría el modal al hacer click en
  "Obtener versión PRO". Hoy NO debe ejecutarse
  porque el botón genera variantes PRO reales.

  Se deja comentado para futura lógica de "locked".
  ==================================================

  const proBtn = document.getElementById('btn-pro');
  proBtn?.addEventListener('click', () => {
    proModal.style.display = 'flex';
  });

  */
});

/* ======================
   ENDPOINT PRO
====================== */

async function generarVersionPro(data) {
  const res = await fetch('/api/generar-descripcion-pro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error('Error generando versión PRO');
  }

  return res.json();
}

/* ======================
   BOTÓN PRO → GENERAR
====================== */

const btnPro = document.getElementById('btn-pro');
const proResult = document.getElementById('pro-result');

if (btnPro) {
  btnPro.addEventListener('click', async () => {
    try {
      btnPro.textContent = 'Generando versión PRO...';
      btnPro.disabled = true;

      const form = document.getElementById('wizardForm');
      const data = Object.fromEntries(new FormData(form));

      const json = await generarVersionPro(data);

      // Mostrar bloque PRO
      proResult.style.display = 'block';

      // Texto principal
      document.getElementById('pro-text').textContent =
        json.variantes.clasica;

      // Copys listos para usar
      document.getElementById('copy-whatsapp').textContent =
        json.copy.whatsapp;

      document.getElementById('copy-instagram').textContent =
        json.copy.instagram;

      document.getElementById('copy-portal').textContent =
        json.copy.portal;

      // Guardar variantes para tabs
      window.__proVariantes = json.variantes;

    } catch (err) {
      console.error(err);
      alert('No se pudo generar la versión PRO');
    } finally {
      btnPro.textContent = 'Obtener versión PRO';
      btnPro.disabled = false;
    }
  });
}

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

const btnCopy = document.getElementById('btn-copy-text');

btnCopy?.addEventListener('click', () => {
  let texto = '';

  if (window.__proVariantes) {
    texto += 'DESCRIPCIÓN\n\n';
    texto += window.__proVariantes.clasica + '\n\n';
  }

  texto += 'COPY WHATSAPP\n' +
    document.getElementById('copy-whatsapp').textContent + '\n\n';

  texto += 'COPY INSTAGRAM\n' +
    document.getElementById('copy-instagram').textContent + '\n\n';

  texto += 'COPY PORTAL\n' +
    document.getElementById('copy-portal').textContent;

  navigator.clipboard.writeText(texto);
  alert('Texto copiado al portapapeles');
});
