import PDFDocument from 'pdfkit';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { variantes, copy } = req.body;

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=descripcion-pro.pdf');

  doc.pipe(res);

  doc.fontSize(18).text('Descripción inmobiliaria PRO', { underline: true });
  doc.moveDown();

  doc.fontSize(12).text(variantes.clasica);
  doc.moveDown();

  doc.fontSize(14).text('Copy WhatsApp');
  doc.fontSize(12).text(copy.whatsapp);
  doc.moveDown();

  doc.fontSize(14).text('Copy Instagram');
  doc.fontSize(12).text(copy.instagram);
  doc.moveDown();

  doc.fontSize(14).text('Copy Portal');
  doc.fontSize(12).text(copy.portal);

  doc.end();
}
