import { Resend } from 'resend';
import { logger } from '../utils/logger';
import { getEmailConfig } from '../config/env-config';

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

export interface EmailData {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  attachments?: EmailAttachment[];
}

let resendClient: Resend | null = null;

const getResend = (): Resend => {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
};

const MAX_EMAIL_ATTEMPTS = 3;

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const sendEmail = async (data: EmailData): Promise<void> => {
  const { from } = getEmailConfig();

  for (let attempt = 1; attempt <= MAX_EMAIL_ATTEMPTS; attempt++) {
    try {
      const { error } = await getResend().emails.send({
        from: from || 'RaphArch <noreply@rapharch.com>',
        to: [data.to].flat(),
        subject: data.subject,
        text: data.text,
        html: data.html,
        attachments: data.attachments?.map((a) => ({
          filename: a.filename,
          content: Buffer.isBuffer(a.content)
            ? a.content.toString('base64')
            : a.content,
          contentType: a.contentType,
        })),
      });

      if (error) {
        throw error;
      }

      logger.info('Email sent successfully', { to: data.to, subject: data.subject });
      return;
    } catch (error) {
      if (attempt === MAX_EMAIL_ATTEMPTS) {
        logger.error(
          'Error sending email',
          { to: data.to, subject: data.subject, attempt },
          error as Error,
        );
        throw new Error('Failed to send email');
      }
      logger.warn('Retrying email send', { to: data.to, subject: data.subject, attempt });
      await delay(attempt * 1000);
    }
  }
};

const buildPasswordResetHtml = (resetLink: string): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f4f4f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color:#EB6426;padding:30px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:600;">RaphArch</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#1a1a1a;margin:0 0 16px;font-size:20px;">Reset Your Password</h2>
              <p style="color:#555555;font-size:15px;line-height:1.6;margin:0 0 24px;">
                We received a request to reset your password. Click the button below to set a new password. This link will expire in 15 minutes.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#EB6426;border-radius:6px;">
                    <a href="${resetLink}" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;border-radius:6px;">Reset Password</a>
                  </td>
                </tr>
              </table>
              <p style="color:#888888;font-size:13px;line-height:1.6;margin:24px 0 0;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetLink}" style="color:#EB6426;word-break:break-all;">${resetLink}</a>
              </p>
              <p style="color:#888888;font-size:13px;line-height:1.6;margin:24px 0 0;">
                If you didn't request this, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #eeeeee;">
              <p style="color:#999999;font-size:12px;margin:0;">
                &copy; ${new Date().getFullYear()} RaphArch. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const sendAdminNewOrderEmail = async (
  order: {
    orderNumber: string;
    total: number;
    currency: string;
    shippingName: string;
  },
  adminEmails: string[],
): Promise<void> => {
  await sendEmail({
    to: adminEmails,
    subject: `New Order ${order.orderNumber}`,
    text:
      `A new order has been placed.\n\n` +
      `Order Number: ${order.orderNumber}\n` +
      `Customer: ${order.shippingName}\n` +
      `Total: ${order.currency} ${order.total.toFixed(2)}\n\n` +
      `Log in to the admin panel to view the full details.`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order ${order.orderNumber}</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f4f4f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color:#1a1a1a;padding:30px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:600;">RaphArch</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#1a1a1a;margin:0 0 16px;font-size:20px;">A New Order Has Been Placed</h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #eee;color:#555555;">Order Number</td>
                  <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;font-weight:600;color:#1a1a1a;">${order.orderNumber}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #eee;color:#555555;">Customer</td>
                  <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;font-weight:600;color:#1a1a1a;">${order.shippingName}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #eee;color:#555555;">Total</td>
                  <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;font-weight:600;color:#1a1a1a;">${order.currency} ${order.total.toFixed(2)}</td>
                </tr>
              </table>
              <p style="color:#888888;font-size:13px;line-height:1.6;margin:24px 0 0;">
                Log in to the admin panel to view the full order details.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #eeeeee;">
              <p style="color:#999999;font-size:12px;margin:0;">
                &copy; ${new Date().getFullYear()} RaphArch. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  });
};

export const sendLoginOtp = async (to: string, otp: string): Promise<void> => {
  await sendEmail({
    to,
    subject: 'OTP Verification Code',
    text: `OTP Verification Code

Hello,

Your one-time verification code is:

${otp}

Please enter this code to complete your verification.

This OTP is valid for 10 minutes. For your security, please do not share this code with anyone.

If you did not request this code, you can safely ignore this email.

Thank you,
Rapharch Team`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your OTP Verification Code</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f4f4f4;color:#000000;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color:#ffffff;padding:36px 44px;text-align:center;border-bottom:1px solid #eeeeee;">
              <h1 style="color:#000000;margin:0;font-size:40px;font-weight:700;font-family:Arial,Helvetica,sans-serif;">Rapharch</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:56px 44px;">
              <h2 style="color:#000000;margin:0 0 24px;font-size:28px;">OTP Verification Code</h2>
              <p style="color:#000000;font-size:23px;line-height:1.35;margin:0 0 24px;">
                Hello,
              </p>
              <p style="color:#000000;font-size:22px;line-height:1.35;margin:0 0 24px;">
                Your one-time verification code is:
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                <tr>
                  <td style="background-color:#f8f8f8;border-radius:8px;border:2px solid #dddddd;padding:28px 56px;text-align:center;">
                    <span style="font-size:52px;font-weight:bold;letter-spacing:10px;color:#000000;">${otp}</span>
                  </td>
                </tr>
              </table>
              <p style="color:#000000;font-size:22px;line-height:1.35;margin:0 0 24px;">
                Please enter this code to complete your verification.
              </p>
              <p style="color:#000000;font-size:22px;line-height:1.35;margin:0 0 24px;">
                This OTP is valid for <strong>10 minutes</strong>. For your security, please do not share this code with anyone.
              </p>
              <p style="color:#000000;font-size:18px;line-height:1.35;margin:0 0 24px;">
                If you did not request this code, you can safely ignore this email.
              </p>
              <p style="color:#000000;font-size:22px;line-height:1.35;margin:0;">
                Thank you,<br>
                <strong>Rapharch Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #eeeeee;">
              <p style="color:#000000;font-size:12px;margin:0;">
                &copy; ${new Date().getFullYear()} Rapharch. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  });
};

export const sendPasswordResetLink = async (to: string, resetLink: string): Promise<void> => {
  await sendEmail({
    to,
    subject: 'Reset Your Password - RaphArch Admin',
    text: `Click the following link to reset your password: ${resetLink}\n\nThis link is valid for 15 minutes.\n\nIf you didn't request this, please ignore this email.`,
    html: buildPasswordResetHtml(resetLink),
  });
};

export const sendSignupOtp = async (to: string, otp: string): Promise<void> => {
  await sendEmail({
    to,
    subject: 'Verify Your Email Address',
    text: `Your OTP for email verification is: ${otp}. It is valid for 10 minutes.\n\nThank you for signing up!`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f4f4f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color:#EB6426;padding:30px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:600;">RaphArch</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#1a1a1a;margin:0 0 16px;font-size:20px;">Verify Your Email Address</h2>
              <p style="color:#555555;font-size:15px;line-height:1.6;margin:0 0 24px;">
                Thank you for signing up! Use the following code to verify your email address. This code will expire in 10 minutes.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
                <tr>
                  <td style="background-color:#f8f8f8;border-radius:8px;border:2px dashed #EB6426;padding:20px 40px;text-align:center;">
                    <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#EB6426;font-family:monospace;">${otp}</span>
                  </td>
                </tr>
              </table>
              <p style="color:#888888;font-size:13px;line-height:1.6;margin:0;">
                If you didn't create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #eeeeee;">
              <p style="color:#999999;font-size:12px;margin:0;">
                &copy; ${new Date().getFullYear()} RaphArch. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  });
};

const buildWelcomeHtml = (name: string): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to RaphArch</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f4f4f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color:#1a1a1a;padding:30px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:600;">RaphArch</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#1a1a1a;margin:0 0 16px;font-size:20px;">Welcome, ${name}!</h2>
              <p style="color:#555555;font-size:15px;line-height:1.6;margin:0 0 24px;">
                Thank you for joining RaphArch. We're excited to help you design your dream space with confidence.
              </p>
              <p style="color:#555555;font-size:15px;line-height:1.6;margin:0 0 24px;">
                Explore our collection of architectural designs, connect with designers, and bring your vision to life.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #eeeeee;">
              <p style="color:#999999;font-size:12px;margin:0;">
                &copy; ${new Date().getFullYear()} RaphArch. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const sendWelcomeEmail = async (to: string, name: string): Promise<void> => {
  await sendEmail({
    to,
    subject: 'Welcome to RaphArch!',
    text: `Welcome ${name}! Thank you for joining RaphArch. We're excited to help you design your dream space.`,
    html: buildWelcomeHtml(name),
  });
};

export const sendOrderConfirmation = async (
  to: string,
  orderId: string,
  orderTotal: number,
  items: Array<{ name: string; quantity: number; price: number }>,
): Promise<void> => {
  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #eee;">${item.name} x${item.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`,
    )
    .join('');

  await sendEmail({
    to,
    subject: `Order Confirmation #${orderId}`,
    text: `Thank you for your order #${orderId}! Total: $${orderTotal.toFixed(2)}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <h1 style="color:#1a1a1a;">Order Confirmation</h1>
        <p>Thank you for your order! Here's your order summary:</p>
        <p style="font-weight:bold;">Order #${orderId}</p>
        <table style="width:100%;border-collapse:collapse;">
          ${itemsHtml}
          <tr>
            <td style="padding:12px 0;font-weight:bold;">Total</td>
            <td style="padding:12px 0;text-align:right;font-weight:bold;">$${orderTotal.toFixed(2)}</td>
          </tr>
        </table>
      </div>
    `,
  });
};

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface InvoiceData {
  orderNumber: string;
  createdAt: Date | string;
  status: string;
  currency: string;
  shippingName: string;
  shippingEmail: string;
  shippingPhone?: string | null;
  shippingAddress?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  shippingCountry?: string | null;
  shippingZip?: string | null;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

const formatMoney = (_currency: string, amount: number): string =>
  `AUD $${amount.toFixed(2)}`;

export const sendOrderInvoice = async (to: string, invoice: InvoiceData): Promise<void> => {
  const { generateInvoicePdf } = await import('./invoice-pdf.service.js');
  const pdf = generateInvoicePdf(invoice);
  const itemsHtml = invoice.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #eee;">
          ${
            item.image
              ? `<img src="${item.image}" width="48" height="48" alt="" style="vertical-align:middle;margin-right:10px;border-radius:4px;object-fit:cover;" />`
              : ''
          }
          <span style="vertical-align:middle;color:#1a1a1a;">${item.name}</span>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #eee;text-align:center;color:#555555;">x${item.quantity}</td>
        <td style="padding:12px 0;border-bottom:1px solid #eee;text-align:right;font-weight:600;color:#1a1a1a;">${formatMoney(invoice.currency, item.price * item.quantity)}</td>
      </tr>`,
    )
    .join('');

  const addressLines = [
    invoice.shippingAddress,
    [invoice.shippingCity, invoice.shippingState].filter(Boolean).join(', '),
    [invoice.shippingCountry, invoice.shippingZip].filter(Boolean).join(' '),
  ]
    .filter(Boolean)
    .join('<br>');

  const dateStr = new Date(invoice.createdAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  await sendEmail({
    to,
    subject: `Your RaphArch Invoice #${invoice.orderNumber}`,
    attachments: [
      {
        filename: `invoice-${invoice.orderNumber}.pdf`,
        content: pdf,
        contentType: 'application/pdf',
      },
    ],
    text:
      `Thank you for your order!\n\n` +
      `Invoice: #${invoice.orderNumber}\n` +
      `Date: ${dateStr}\n` +
      `Status: ${invoice.status}\n` +
      `Total: ${formatMoney(invoice.currency, invoice.total)}\n\n` +
      `Items:\n` +
      invoice.items.map((i) => `  - ${i.name} x${i.quantity} (${formatMoney(invoice.currency, i.price * i.quantity)})`).join('\n'),
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice #${invoice.orderNumber}</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f4f4f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color:#1a1a1a;padding:30px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:600;">RaphArch</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#1a1a1a;margin:0 0 8px;font-size:22px;">Thank you for your order!</h2>
              <p style="color:#555555;font-size:14px;margin:0 0 24px;">A confirmation of your purchase is below.</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:8px 0;color:#555555;">Invoice Number</td>
                  <td style="padding:8px 0;text-align:right;font-weight:600;color:#1a1a1a;">#${invoice.orderNumber}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#555555;">Date</td>
                  <td style="padding:8px 0;text-align:right;color:#1a1a1a;">${dateStr}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#555555;">Status</td>
                  <td style="padding:8px 0;text-align:right;color:#1a1a1a;">${invoice.status}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#555555;">Bill To</td>
                  <td style="padding:8px 0;text-align:right;color:#1a1a1a;">${invoice.shippingName}</td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid #1a1a1a;">
                <tr>
                  <td style="padding:12px 0;font-weight:700;color:#1a1a1a;font-size:13px;text-transform:uppercase;">Item</td>
                  <td style="padding:12px 0;font-weight:700;color:#1a1a1a;font-size:13px;text-transform:uppercase;text-align:center;">Qty</td>
                  <td style="padding:12px 0;font-weight:700;color:#1a1a1a;font-size:13px;text-transform:uppercase;text-align:right;">Amount</td>
                </tr>
                ${itemsHtml}
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                <tr>
                  <td style="padding:6px 0;color:#555555;">Subtotal</td>
                  <td style="padding:6px 0;text-align:right;color:#1a1a1a;">${formatMoney(invoice.currency, invoice.subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#555555;">Tax</td>
                  <td style="padding:6px 0;text-align:right;color:#1a1a1a;">${formatMoney(invoice.currency, invoice.tax)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#555555;">Shipping</td>
                  <td style="padding:6px 0;text-align:right;color:#1a1a1a;">${formatMoney(invoice.currency, invoice.shipping)}</td>
                </tr>
                <tr>
                  <td style="padding:12px 0;font-weight:700;color:#1a1a1a;font-size:16px;border-top:2px solid #1a1a1a;">Total</td>
                  <td style="padding:12px 0;font-weight:700;color:#1a1a1a;font-size:16px;text-align:right;border-top:2px solid #1a1a1a;">${formatMoney(invoice.currency, invoice.total)}</td>
                </tr>
              </table>

              ${
                addressLines
                  ? `<p style="color:#888888;font-size:13px;line-height:1.6;margin:24px 0 0;">
                      <strong style="color:#555555;">Shipping Address:</strong><br>${addressLines}
                    </p>`
                  : ''
              }
              <p style="color:#888888;font-size:13px;line-height:1.6;margin:24px 0 0;">
                If you have any questions, reply to this email or contact our support team.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #eeeeee;">
              <p style="color:#999999;font-size:12px;margin:0;">
                &copy; ${new Date().getFullYear()} RaphArch. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  });
};

export const emailService = {
  sendEmail,
  sendLoginOtp,
  sendPasswordResetLink,
  sendSignupOtp,
  sendWelcomeEmail,
  sendOrderConfirmation,
  sendAdminNewOrderEmail,
  sendOrderInvoice,
};

export default emailService;
