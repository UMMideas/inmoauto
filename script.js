document.addEventListener('DOMContentLoaded', () => {

  /* ======================
     WIZARD
  ====================== */

  const steps = document.querySelectorAll('.step');
  const stepIndicators = document.querySelectorAll('.wizard-steps li');
  let current = 0;

  function updateSteps() {
    steps.forEach((s, i) => s.classList.toggle('active', i === current));
    stepIndicators.forEach((l, i) => l.classList.toggle('active', i === current));
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

    result.textContent = "Generando descripción con IA...";
    proCTA.style.display = "none";

    try {
      const data = Object.fromEntries(new FormData(form));

      const res = await fetch('/api/generar-descripcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const json = await res.json();

      result.textContent = json.descripcion || "No se pudo generar la descripción.";

      if (json.demo === true) {
        proCTA.style.display = "block";
      }

    } catch (err) {
      console.error(err);
      result.textContent = "Error al generar la descripción.";
    }
  });

  /* ======================
     MODAL PRO
  ====================== */

  const proBtn = document.getElementById('btn-pro');
  const proModal = document.getElementById('pro-modal');
  const closePro = document.getElementById('close-pro');
  const proForm = document.getElementById('pro-lead-form');
  const proSuccess = document.getElementById('pro-success');

  proBtn?.addEventListener('click', () => {
    proModal.style.display = 'flex';
  });

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

});
