export default async function handler(req, res) {
  const { email } = req.body;

  // DEMO temporal
  const usuariosPro = [
    "test@pro.com",
    "admin@inmoauto.com"
  ];

  const isPro = usuariosPro.includes(email);

  return res.status(200).json({
    pro: isPro
  });
}
