import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import type { InvoiceData } from './email.service.js';
import { INVOICE_LOGO_JPEG } from './invoice-logo.js';

const LOGO_PATH = path.join(
  __dirname,
  'assets',
  'rapharch-logo.jpg',
);

const loadLogo = (): Buffer => {
  try {
    return fs.readFileSync(LOGO_PATH);
  } catch {
    return INVOICE_LOGO_JPEG;
  }
};

// ============================================================
// PAGE
// ============================================================

const PAGE_W = 595;
const PAGE_H = 842;

const M = 40;
const CW = PAGE_W - M * 2;

// Footer position
const FOOTER_Y = PAGE_H - 72;

// Bottom payment section
const PAYMENT_Y = 610;

// Maximum Y allowed for invoice content before bottom section
const CONTENT_BOTTOM = PAYMENT_Y - 25;

// Page continuation bottom limit
const BOTTOM = 95;

// ============================================================
// COLORS
// ============================================================

const GREEN = '#1C3822';
const INK = '#212121';
const RULE = '#DEDEDE';
const SOFT = '#FAF8F3';

// ============================================================
// CHARACTERS
// ============================================================

const NON_ASCII: Record<string, string> = {
  '×': 'x',
  '–': '-',
  '—': '-',
  '‘': "'",
  '’': "'",
  '“': '"',
  '”': '"',
  '•': '-',
  ' ': ' ',
};

// ============================================================
// HELPERS
// ============================================================

const printable = (value: string): string =>
  String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(
      /[^\x20-\x7E]/g,
      (ch) => NON_ASCII[ch] ?? ' ',
    );

const money = (
  currency: string,
  amount: number,
): string =>
  `${currency || 'AUD'} $${amount.toLocaleString('en-AU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// ============================================================
// MAIN PDF GENERATOR
// ============================================================

export const generateInvoicePdf = async (
  invoice: InvoiceData,
): Promise<Buffer> => {
  // ==========================================================
  // COMPANY
  // ==========================================================

  const company = {
    name:
      invoice.company?.name ||
      'RaphArch',

    location:
      invoice.company?.location ||
      'Kawana Shopping Center',

    address:
      invoice.company?.address ||
      'Melbourne, Australia',

    phone:
      invoice.company?.phone ||
      '0756 1234',

    email:
      invoice.company?.email ||
      'info@rapharch.com.au',

    website:
      invoice.company?.website ||
      'www.rapharch.com.au',

    abn:
      invoice.company?.abn ||
      '',

    bank:
      invoice.company?.bank,
  };

  // ==========================================================
  // DATE
  // ==========================================================

  const created = new Date(invoice.createdAt);

  const dateStr = created.toLocaleDateString(
    'en-AU',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  );

  // ==========================================================
  // PAYMENT STATUS
  // ==========================================================

  const paid =
    Boolean(invoice.paidAt) ||
    [
      'paid',
      'captured',
      'succeeded',
    ].includes(
      String(
        invoice.paymentStatus || '',
      ).toLowerCase(),
    );

  const received = paid
    ? invoice.total
    : 0;

  const due =
    invoice.total - received;

  // ==========================================================
  // PDF DOCUMENT
  // ==========================================================

  const doc = new PDFDocument({
    size: 'A4',

    margins: {
      top: M,
      bottom: M,
      left: M,
      right: M,
    },

    bufferPages: true,

    info: {
      Title:
        `Invoice ${invoice.orderNumber}`,

      Author:
        company.name,

      Creator:
        company.name,
    },
  });

  // ==========================================================
  // LOGO
  // ==========================================================

  const logo = loadLogo();

  // ==========================================================
  // PDF BUFFER
  // ==========================================================

  const chunks: Buffer[] = [];

  doc.on(
    'data',
    (chunk: Buffer) => {
      chunks.push(chunk);
    },
  );

  const finished =
    new Promise<Buffer>(
      (resolve, reject) => {
        doc.on(
          'end',
          () => {
            resolve(
              Buffer.concat(chunks),
            );
          },
        );

        doc.on(
          'error',
          reject,
        );
      },
    );

  // ==========================================================
  // DRAWING STATE
  // ==========================================================

  let drawing = true;

  // ==========================================================
  // TEXT
  // ==========================================================

  const text = (
    value: string,
    x: number,
    y: number,
    opts: {
      size?: number;
      bold?: boolean;
      color?: string;
    } = {},
  ): void => {
    if (!drawing) return;

    doc
      .font(
        opts.bold
          ? 'Times-Bold'
          : 'Times-Roman',
      )
      .fontSize(
        opts.size ?? 10,
      )
      .fillColor(
        opts.color ?? INK,
      )
      .text(
        printable(value),
        x,
        y,
        {
          lineBreak: false,
          align: 'left',
        },
      );
  };

  // ==========================================================
  // LINE
  // ==========================================================

  const line = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color = RULE,
    width = 0.75,
  ): void => {
    if (!drawing) return;

    doc
      .save()
      .strokeColor(color)
      .lineWidth(width)
      .moveTo(x1, y1)
      .lineTo(x2, y2)
      .stroke()
      .restore();
  };

  // ==========================================================
  // RECTANGLE
  // ==========================================================

  const rect = (
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
  ): void => {
    if (!drawing) return;

    doc
      .save()
      .rect(x, y, w, h)
      .fill(color)
      .restore();
  };

  // ==========================================================
  // IMAGE
  // ==========================================================

  const image = (
    buf: Buffer,
    x: number,
    yy: number,
    w: number,
    h: number,
  ): void => {
    if (!drawing) return;

    doc.image(
      buf,
      x,
      yy,
      {
        width: w,
        height: h,
      },
    );
  };

  // ==========================================================
  // TEXT WRAP
  // ==========================================================

  const wrap = (
    value: string,
    maxWidth: number,
    size: number,
    bold = false,
  ): string[] => {
    doc
      .font(
        bold
          ? 'Times-Bold'
          : 'Times-Roman',
      )
      .fontSize(size);

    const words =
      printable(value)
        .split(' ')
        .filter(Boolean);

    const lines: string[] = [];

    let current = '';

    for (const word of words) {
      const candidate =
        current
          ? `${current} ${word}`
          : word;

      if (
        !current ||
        doc.widthOfString(
          candidate,
        ) <= maxWidth
      ) {
        current = candidate;
      } else {
        lines.push(current);
        current = word;
      }
    }

    if (current) {
      lines.push(current);
    }

    return lines.length
      ? lines
      : [''];
  };

  // ==========================================================
  // CURRENT Y
  // ==========================================================

  let y = 50;

  // ==========================================================
  // NEW PAGE
  // ==========================================================

  const newPage = (
    continued: boolean,
  ): void => {
    doc.addPage();

    y = 70;

    if (continued) {
      text(
        `${company.name} - Invoice ${invoice.orderNumber}`,
        M,
        y,
        {
          size: 9,
          bold: true,
        },
      );

      y += 22;
    }
  };

  // ==========================================================
  // ENSURE CONTENT FITS
  // ==========================================================

  const ensure = (
    height: number,
  ): boolean => {
    if (
      y + height <=
      CONTENT_BOTTOM
    ) {
      return false;
    }

    newPage(true);

    return true;
  };

  // ==========================================================
  // TABLE HEADER
  // ==========================================================

  const tableHeader = (): void => {
    rect(
      M,
      y,
      CW,
      18,
      SOFT,
    );

    line(
      M,
      y,
      M + CW,
      y,
      GREEN,
      1.2,
    );

    text(
      'Description',
      M + 8,
      y + 5,
      {
        size: 10,
        bold: true,
      },
    );

    text(
      'Qty',
      300,
      y + 5,
      {
        size: 10,
        bold: true,
      },
    );

    text(
      'Unit Price',
      355,
      y + 5,
      {
        size: 10,
        bold: true,
      },
    );

    text(
      'Amount',
      470,
      y + 5,
      {
        size: 10,
        bold: true,
      },
    );

    line(
      M,
      y + 18,
      M + CW,
      y + 18,
      RULE,
      0.75,
    );

    y += 22;
  };

  // ==========================================================
  // HEADER
  // ==========================================================

  const drawHeader =
    (): void => {
      const logoSize = 50;

      image(
        logo,
        M,
        y,
        logoSize,
        logoSize,
      );

      const lines = [
        company.name,
        company.location,
        company.address,
        company.phone &&
          `Phone: ${company.phone}`,
        company.email &&
          `Email: ${company.email}`,
        company.website,
        company.abn &&
          `ABN: ${company.abn}`,
      ].filter(
        Boolean,
      ) as string[];

      let rightY =
        y + 4;

      lines.forEach(
        (
          value,
          index,
        ) => {
          text(
            value,
            345,
            rightY,
            {
              size:
                index === 0
                  ? 11
                  : 9,

              bold:
                index === 0,
            },
          );

          rightY +=
            index === 0
              ? 14
              : 12;
        },
      );

      y = Math.max(
        y +
          logoSize +
          10,
        rightY + 6,
      );

      line(
        M,
        y,
        M + CW,
        y,
        RULE,
        0.75,
      );

      y += 18;
    };

  // ==========================================================
  // BILL TO
  // ==========================================================

  const drawBillTo =
    (): void => {
      const addressLines = [
        invoice.shippingAddress,

        [
          invoice.shippingCity,
          invoice.shippingState,
        ]
          .filter(Boolean)
          .join(', '),

        [
          invoice.shippingCountry,
          invoice.shippingZip,
        ]
          .filter(Boolean)
          .join(' '),

        invoice.shippingEmail,

        invoice.shippingPhone,
      ].filter(
        Boolean,
      ) as string[];

      // -------------------------
      // LEFT
      // -------------------------

      text(
        'BILL TO',
        M,
        y,
        {
          size: 9,
          bold: true,
          color: GREEN,
        },
      );

      let leftY =
        y + 14;

      text(
        invoice.shippingName,
        M,
        leftY,
        {
          size: 11,
          bold: true,
        },
      );

      leftY += 14;

      addressLines.forEach(
        (value) => {
          wrap(
            value,
            280,
            9.5,
          ).forEach(
            (part) => {
              text(
                part,
                M,
                leftY,
                {
                  size: 9.5,
                },
              );

              leftY += 12;
            },
          );
        },
      );

      // -------------------------
      // RIGHT
      // -------------------------

      let rightY = y;

      text(
        'TAX INVOICE',
        355,
        rightY,
        {
          size: 14,
          bold: true,
        },
      );

      rightY += 18;

      text(
        invoice.orderNumber,
        355,
        rightY,
        {
          size: 11,
          bold: true,
          color: GREEN,
        },
      );

      rightY += 20;

      const rows: Array<
        [string, string]
      > = [
        [
          'Date:',
          dateStr,
        ],

        [
          'Reference:',
          invoice.orderNumber,
        ],

        [
          'Status:',
          invoice.status,
        ],

        [
          'Payment:',
          invoice.paymentStatus ||
            invoice.paymentMethod ||
            'Pending',
        ],
      ];

      rows.forEach(
        ([label, value]) => {
          text(
            label,
            355,
            rightY,
            {
              size: 9,
            },
          );

          text(
            value,
            415,
            rightY,
            {
              size: 9.5,
              bold: true,
            },
          );

          rightY += 14;
        },
      );

      y =
        Math.max(
          leftY,
          rightY,
        ) + 6;
    };

  // ==========================================================
  // TOTALS
  // ==========================================================

  const drawTotals =
    (): void => {
      const rows: Array<
        [string, string, boolean]
      > = [
        [
          'Subtotal:',
          money(
            invoice.currency,
            invoice.subtotal,
          ),
          false,
        ],

        [
          'Shipping:',
          invoice.shipping > 0
            ? money(
                invoice.currency,
                invoice.shipping,
              )
            : 'Free',
          false,
        ],

        [
          'Tax:',
          money(
            invoice.currency,
            invoice.tax,
          ),
          false,
        ],

        [
          'Invoice Total:',
          money(
            invoice.currency,
            invoice.total,
          ),
          true,
        ],

        [
          'Payments Received:',
          money(
            invoice.currency,
            received,
          ),
          false,
        ],
      ];

      rows.forEach(
        ([
          label,
          value,
          bold,
        ]) => {
          text(
            label,
            355,
            y,
            {
              size:
                bold
                  ? 11
                  : 9.5,

              bold,
            },
          );

          text(
            value,
            460,
            y,
            {
              size:
                bold
                  ? 11
                  : 9.5,

              bold,
            },
          );

          y +=
            bold
              ? 16
              : 12;
        },
      );

      y += 2;

      line(
        355,
        y,
        M + CW,
        y,
        GREEN,
        1.2,
      );

      y += 6;

      text(
        'Amount Due:',
        355,
        y,
        {
          size: 12,
          bold: true,
          color: GREEN,
        },
      );

      text(
        money(
          invoice.currency,
          due,
        ),
        460,
        y,
        {
          size: 12,
          bold: true,
          color: GREEN,
        },
      );

      y += 16;

      text(
        `Payment Due By: ${dateStr}`,
        355,
        y,
        {
          size: 9,
        },
      );

      y += 14;
    };

  // ==========================================================
  // BOTTOM PAYMENT SECTION
  // ==========================================================

  const drawPaymentSection =
    (
      noteLines: string[],
    ): void => {
      // IMPORTANT:
      // This section does NOT use the current
      // invoice y-position.
      //
      // It is fixed near the bottom of
      // the A4 page.

      const startY =
        PAYMENT_Y;

      // -------------------------
      // TOP RULE
      // -------------------------

      line(
        M,
        startY,
        M + CW,
        startY,
        RULE,
        0.75,
      );

      // -------------------------
      // THANK YOU
      // -------------------------

      text(
        'THANK YOU!',
        M,
        startY + 8,
        {
          size: 16,
          bold: true,
          color: GREEN,
        },
      );

      // -------------------------
      // ONLINE PAYMENTS
      // -------------------------

      let onlineY =
        startY + 34;

      text(
        'Online Payments',
        M,
        onlineY,
        {
          size: 10,
          bold: true,
        },
      );

      onlineY += 13;

      text(
        'Visa  |  Mastercard  |  AMEX',
        M,
        onlineY,
        {
          size: 9,
        },
      );

      onlineY += 12;

      text(
        'Card payment processing fees apply',
        M,
        onlineY,
        {
          size: 8.5,
        },
      );

      // -------------------------
      // DIRECT DEPOSIT
      // -------------------------

      let bankY =
        startY + 34;

      if (company.bank) {
        text(
          'Direct Deposit Payments',
          300,
          bankY,
          {
            size: 10,
            bold: true,
          },
        );

        bankY += 13;

        const bankLines = [
          company.name,

          company.bank.bsb &&
            `BSB ${company.bank.bsb}`,

          company.bank.account &&
            `Acc No. ${company.bank.account}`,

          `Inv No. ${invoice.orderNumber} as reference`,

          company.email,
        ].filter(
          Boolean,
        ) as string[];

        bankLines.forEach(
          (value) => {
            text(
              value,
              300,
              bankY,
              {
                size: 9,
              },
            );

            bankY += 12;
          },
        );
      }

      // -------------------------
      // NOTES
      // -------------------------

      let bottomY =
        Math.max(
          onlineY,
          bankY,
        );

      if (noteLines.length) {
        bottomY += 8;

        noteLines.forEach(
          (noteLine) => {
            text(
              noteLine,
              M,
              bottomY,
              {
                size: 9,
              },
            );

            bottomY += 12;
          },
        );
      }

      // -------------------------
      // TERMS
      // -------------------------

      bottomY += 6;

      text(
        'Terms and Conditions apply.',
        M,
        bottomY,
        {
          size: 8.5,
        },
      );

      if (company.website) {
        text(
          `For full details, visit ${company.website}`,
          M + 150,
          bottomY,
          {
            size: 8.5,
          },
        );
      }
    };

  // ==========================================================
  // DRAW HEADER
  // ==========================================================

  drawHeader();

  // ==========================================================
  // DRAW BILL TO
  // ==========================================================

  drawBillTo();

  // ==========================================================
  // TABLE
  // ==========================================================

  tableHeader();

  // ==========================================================
  // ITEMS
  // ==========================================================

  invoice.items.forEach(
    (item) => {
      const description =
        wrap(
          item.name,
          245,
          11,
        );

      const rowHeight =
        description.length *
          14 +
        14;

      // Leave enough space for:
      //
      // totals
      // bottom payment section
      // footer
      //
      if (
        ensure(
          rowHeight + 40,
        )
      ) {
        tableHeader();
      }

      let rowY =
        y + 7;

      description.forEach(
        (part) => {
          text(
            part,
            M + 8,
            rowY,
            {
              size: 11,
            },
          );

          rowY += 14;
        },
      );

      text(
        String(item.quantity),
        300,
        y + 7,
        {
          size: 11,
        },
      );

      text(
        money(
          invoice.currency,
          item.price,
        ),
        355,
        y + 7,
        {
          size: 11,
        },
      );

      text(
        money(
          invoice.currency,
          item.price *
            item.quantity,
        ),
        470,
        y + 7,
        {
          size: 11,
          bold: true,
        },
      );

      y += rowHeight;

      line(
        M,
        y,
        M + CW,
        y,
        RULE,
        0.5,
      );
    },
  );

  // ==========================================================
  // NOTES
  // ==========================================================

  y += 10;

  const noteLines =
    invoice.notes
      ? wrap(
          invoice.notes,
          480,
          9,
        )
      : [];

  // ==========================================================
  // TOTALS
  //
  // We reserve the bottom section.
  // ==========================================================

  // Calculate how much space totals need
  // without actually drawing them.

  const totalsStartY =
    y;

  drawing = false;

  drawTotals();

  const totalsEndY =
    y;

  drawing = true;

  // Restore original Y
  y = totalsStartY;

  const totalsHeight =
    totalsEndY -
    totalsStartY;

  // ==========================================================
  // CHECK IF TOTALS FIT ABOVE PAYMENT SECTION
  // ==========================================================

  if (
    y +
      totalsHeight >
    PAYMENT_Y - 20
  ) {
    // Not enough room.
    //
    // Move totals to a fresh page.
    newPage(true);

    // Start a small table header on
    // the new page for consistency.
    tableHeader();
  }

  // ==========================================================
  // DRAW TOTALS
  // ==========================================================

  drawTotals();

  // ==========================================================
  // DRAW BOTTOM PAYMENT SECTION
  // ==========================================================

  drawPaymentSection(
    noteLines,
  );

  // ==========================================================
  // FOOTER
  // ==========================================================

  const footerText = [
    company.name,

    company.abn &&
      `ABN: ${company.abn}`,

    company.website,
  ]
    .filter(Boolean)
    .join(' | ');

  // ==========================================================
  // ALL PAGE FOOTERS
  // ==========================================================

  const range =
    doc.bufferedPageRange();

  for (
    let index =
      range.start;

    index <
    range.start +
      range.count;

    index += 1
  ) {
    doc.switchToPage(
      index,
    );

    const pageHeight =
      doc.page.height;

    // Footer line
    line(
      M,
      pageHeight - 72,
      M + CW,
      pageHeight - 72,
      RULE,
      0.75,
    );

    // Footer text
    text(
      footerText,
      M,
      pageHeight - 64,
      {
        size: 8,
      },
    );

    // Page number
    text(
      `Page ${
        index -
        range.start +
        1
      } of ${range.count}`,
      470,
      pageHeight - 64,
      {
        size: 8,
      },
    );
  }

  // ==========================================================
  // END PDF
  // ==========================================================

  doc.end();

  return finished;
};
