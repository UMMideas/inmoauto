import PDFDocument from 'pdfkit';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false });
  }

  const { descripcion, copy } = req.body;

  const doc = new PDFDocument({ margin: 40 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    'attachment; filename="descripcion-inmobiliaria.pdf"'
  );

  doc.pipe(res);

  doc.fontSize(18).text('Descripción inmobiliaria', { underline: true });
  doc.moveDown();

  doc.fontSize(12).text(descripcion);
  doc.moveDown(2);

  doc.fontSize(14).text('Copys', { underline: true });
  doc.moveDown();

  doc.fontSize(11).text(`WhatsApp:\n${copy.whatsapp}`);
  doc.moveDown();

  doc.text(`Instagram:\n${copy.instagram}`);
  doc.moveDown();

  doc.text(`Portal:\n${copy.portal}`);

  doc.end();
}
