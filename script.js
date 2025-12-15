document.getElementById('propertyForm').addEventListener('submit', async e => {
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

