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

  const data = Object.fromEntries(new FormData(e.target));

  const res = await fetch('/api/generar-descripcion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const json = await res.json();
  document.getElementById('result').textContent =
    JSON.stringify(json, null, 2);
});
