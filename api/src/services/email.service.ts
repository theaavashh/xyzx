import { Resend } from 'resend';
import { logger } from '../utils/logger';
import { getEmailConfig } from '../config/env-config';

export interface EmailData {
  to: string;
  subject: string;
  text: string;
  html?: string;
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

export const sendEmail = async (data: EmailData): Promise<void> => {
  const { from } = getEmailConfig();

  try {
    const { error } = await getResend().emails.send({
      from: from || 'RaphArch <noreply@rapharch.com>',
      to: [data.to],
      subject: data.subject,
      text: data.text,
      html: data.html,
    });

    if (error) {
      throw error;
    }

    logger.info('Email sent successfully', { to: data.to, subject: data.subject });
  } catch (error) {
    logger.error('Error sending email', { to: data.to, subject: data.subject }, error as Error);
    throw new Error('Failed to send email');
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

export const sendLoginOtp = async (to: string, otp: string): Promise<void> => {
  await sendEmail({
    to,
    subject: 'Your Login OTP',
    text: `Your OTP for login is: ${otp}. It is valid for 10 minutes.`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Login OTP</title>
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
              <h2 style="color:#1a1a1a;margin:0 0 16px;font-size:20px;">Your Login Code</h2>
              <p style="color:#555555;font-size:15px;line-height:1.6;margin:0 0 24px;">
                Use the following one-time code to log in to your account. This code will expire in 10 minutes.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
                <tr>
                  <td style="background-color:#f8f8f8;border-radius:8px;border:2px dashed #EB6426;padding:20px 40px;text-align:center;">
                    <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#EB6426;font-family:monospace;">${otp}</span>
                  </td>
                </tr>
              </table>
              <p style="color:#888888;font-size:13px;line-height:1.6;margin:0;">
                If you didn't request this code, you can safely ignore this email.
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
            <td style="background-color:#D4AF37;padding:30px 40px;text-align:center;">
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

export const emailService = {
  sendEmail,
  sendLoginOtp,
  sendPasswordResetLink,
  sendSignupOtp,
  sendWelcomeEmail,
  sendOrderConfirmation,
};

export default emailService;
