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
  result.textContent = "Generando descripción con IA...";

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

    result.textContent = json.descripcion;

  } catch (err) {
    console.error(err);
    result.textContent =
      "Ocurrió un error al generar la descripción. Intentá nuevamente.";
  }
});

