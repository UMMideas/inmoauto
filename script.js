const steps = document.querySelectorAll('.step');
const stepIndicators = document.querySelectorAll('.wizard-steps li');
let current = 0;

function updateSteps() {
  steps.forEach((s, i) => s.classList.toggle('active', i === current));
  stepIndicators.forEach((l, i) => l.classList.toggle('active', i === current));
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('next')) {
    current++;
    updateSteps();
  }
  if (e.target.classList.contains('prev')) {
    current--;
    updateSteps();
  }
});

document.getElementById('wizardForm').addEventListener('submit', async e => {
  e.preventDefault();

  const result = document.getElementById('result');
  const proCTA = document.getElementById('pro-cta');

  // Reset UI
  result.textContent = "Generando descripción con IA...";
  if (proCTA) proCTA.style.display = "none";

  try {
    const data = Object.fromEntries(new FormData(e.target));

    const res = await fetch('/api/generar-descripcion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      throw new Error('Error en la respuesta del servidor');
    }

    const json = await res.json();

    // Mostrar descripción
    result.textContent = json.descripcion || "No se pudo generar la descripción.";

    // Mostrar CTA PRO solo en modo demo
    if (json.demo === true && proCTA) {
      proCTA.style.display = "block";
    }

  } catch (err) {
    console.error(err);
    result.textContent =
      "Ocurrió un error al generar la descripción. Intentá nuevamente.";
  }
});

// Acción del botón PRO (placeholder)
const btnPro = document.getElementById('btn-pro');
if (btnPro) {
  btnPro.addEventListener('click', () => {
    alert(
      "Versión PRO próximamente:\n\n" +
      "• Descripciones completas\n" +
      "• Variantes por estilo\n" +
      "• Copy listo para publicar\n" +
      "• Exportar PDF / texto\n\n" +
      "🚀 Muy pronto disponible"
    );
  });
}

const proBtn = document.getElementById('btn-pro');
const proModal = document.getElementById('pro-modal');
const closePro = document.getElementById('close-pro');

if (proBtn) {
  proBtn.addEventListener('click', () => {
    proModal.style.display = 'flex';
  });
}

if (closePro) {
  closePro.addEventListener('click', () => {
    proModal.style.display = 'none';
  });
}

proModal?.addEventListener('click', e => {
  if (e.target === proModal) {
    proModal.style.display = 'none';
  }
});



