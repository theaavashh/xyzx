import type { InvoiceData } from './email.service';

interface PdfText {
  text: string;
  x: number;
  y: number;
  size?: number;
  bold?: boolean;
}

const escapePdf = (s: string): string =>
  s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

const formatMoney = (_currency: string, amount: number): string =>
  `AUD $${amount.toFixed(2)}`;

/**
 * Builds a minimal, valid single-page A4 PDF from text lines.
 * No external dependencies.
 */
export const generateInvoicePdf = (invoice: InvoiceData): Buffer => {
  const PAGE_W = 595;
  const PAGE_H = 842;
  const lines: PdfText[] = [];

  let y = PAGE_H - 60;

  lines.push({ text: 'RaphArch', x: 50, y, size: 22, bold: true });
  lines.push({ text: 'INVOICE', x: PAGE_W - 200, y, size: 16, bold: true });
  y -= 30;

  lines.push({ text: `Invoice Number: #${invoice.orderNumber}`, x: 50, y, size: 11 });
  y -= 16;
  const dateStr = new Date(invoice.createdAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  lines.push({ text: `Date: ${dateStr}`, x: 50, y, size: 11 });
  y -= 16;
  lines.push({ text: `Status: ${invoice.status}`, x: 50, y, size: 11 });
  y -= 16;
  lines.push({ text: `Bill To: ${invoice.shippingName}`, x: 50, y, size: 11 });
  y -= 16;
  const address = [
    invoice.shippingAddress,
    [invoice.shippingCity, invoice.shippingState].filter(Boolean).join(', '),
    [invoice.shippingCountry, invoice.shippingZip].filter(Boolean).join(' '),
  ]
    .filter(Boolean)
    .join(', ');
  if (address) {
    lines.push({ text: `Ship To: ${address}`, x: 50, y, size: 11 });
    y -= 16;
  }
  y -= 14;

  // Table header
  lines.push({ text: 'Item', x: 50, y, size: 11, bold: true });
  lines.push({ text: 'Qty', x: 400, y, size: 11, bold: true });
  lines.push({ text: 'Amount', x: 480, y, size: 11, bold: true });
  y -= 6;
  lines.push({ text: '--------------------------------------------------------------', x: 50, y, size: 10 });
  y -= 18;

  for (const item of invoice.items) {
    const name = item.name.length > 48 ? `${item.name.slice(0, 45)}...` : item.name;
    lines.push({ text: name, x: 50, y, size: 10 });
    lines.push({ text: `x${item.quantity}`, x: 400, y, size: 10 });
    lines.push({ text: formatMoney(invoice.currency, item.price * item.quantity), x: 480, y, size: 10 });
    y -= 16;
  }

  y -= 6;
  lines.push({ text: '--------------------------------------------------------------', x: 50, y, size: 10 });
  y -= 18;

  lines.push({ text: 'Subtotal', x: 380, y, size: 11 });
  lines.push({ text: formatMoney(invoice.currency, invoice.subtotal), x: 480, y, size: 11 });
  y -= 16;
  lines.push({ text: 'Tax', x: 380, y, size: 11 });
  lines.push({ text: formatMoney(invoice.currency, invoice.tax), x: 480, y, size: 11 });
  y -= 16;
  lines.push({ text: 'Shipping', x: 380, y, size: 11 });
  lines.push({ text: formatMoney(invoice.currency, invoice.shipping), x: 480, y, size: 11 });
  y -= 18;
  lines.push({ text: 'TOTAL', x: 380, y, size: 13, bold: true });
  lines.push({ text: formatMoney(invoice.currency, invoice.total), x: 480, y, size: 13, bold: true });

  // Build content stream
  const content = lines
    .map((l) => {
      const size = l.size ?? 11;
      const font = l.bold ? 2 : 1;
      return `BT /F${font} ${size} Tf 1 0 0 1 ${l.x} ${l.y} Tm (${escapePdf(l.text)}) Tj ET`;
    })
    .join('\n');

  const objects: string[] = [];
  objects.push('<< /Type /Catalog /Pages 2 0 R >>');
  objects.push('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  objects.push(
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
  );
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  objects.push(`<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`);

  let pdf = '%PDF-1.4\n';
  let offset = pdf.length;
  const offsets: number[] = [];
  objects.forEach((obj, i) => {
    offsets.push(offset);
    const str = `${i + 1} 0 obj\n${obj}\nendobj\n`;
    pdf += str;
    offset += str.length;
  });

  let xref = `xref\n0 ${objects.length + 1}\n`;
  xref += '0000000000 65535 f \n';
  offsets.forEach((off) => {
    xref += `${off.toString().padStart(10, '0')} 00000 n \n`;
  });
  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${offset}\n%%EOF`;
  pdf += xref + trailer;

  return Buffer.from(pdf, 'latin1');
};
