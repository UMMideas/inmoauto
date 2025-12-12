INMOAUTO.ai — Starter bundle
============================

What you received:
- A static site (index.html, styles.css, script.js) ready to deploy
- assets/ (logo.svg + homepage image)
- server/ serverless function stubs (JavaScript) to deploy on Vercel or similar
- README with instructions

How to use (quick):
1) Unzip the bundle.
2) Option A (fast): Deploy to Vercel
   - Create an account at https://vercel.com
   - New Project -> Import from Git -> create a new Git repo containing these files
   - Add Environment Variables in Vercel dashboard (see below)
   - Deploy

3) Option B (manual): serve locally with a static server for preview:
   - python -m http.server 8000
   - open http://localhost:8000

Environment variables to set on your serverless host:
- OPENAI_API_KEY  (required)  -> OpenAI API key for text generation
- RESEND_API_KEY   (optional)  -> Resend.com API key for transactional email
- GOOGLE_DRIVE_SA (optional)  -> base64 service account JSON for Drive uploads (if you configure Drive integration)
- STATIC_HOST      (optional)  -> if you host assets in a CDN

Serverless endpoints:
- /api/generate-description  (POST) -> accepts form payload, returns JSON with generated texts
- /api/generate-photos       (POST) -> accepts photos, returns processed images
- /api/generate-pdf          (POST) -> accepts payload, returns a PDF (or link)
- /api/send-email            (POST) -> sends an email (uses RESEND_API_KEY or SMTP)

Notes & next steps:
- The server files in /server are examples. You must add your API keys and deploy them to Vercel or Netlify functions.
- You can alternatively use Make (make.com) or Zapier to implement the same flows without hosting server code.
- Replace config.js values with your live form URL and API base URL after deployment.
