// Minimal client-side interactions and placeholders for API calls.
// Replace endpoints in config.js with your deployed serverless endpoints.

document.getElementById("btn-start").addEventListener("click", function(e){
  e.preventDefault();
  window.location.href = config.FORM_URL || "#";
});

document.getElementById("btn-cargar").addEventListener("click", function(){
  window.location.href = config.FORM_URL || "#";
});

// Example function to call serverless endpoint (POST) to generate description
async function generateDescription(payload){
  const resp = await fetch(config.API_BASE + "/generate-description", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if(!resp.ok) throw new Error("Error generating description");
  return resp.json();
}
