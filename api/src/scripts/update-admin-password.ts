import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

async function updatePasswordAndSend() {
  const email = 'aavash.ganeju@gmail.com';
  const name = 'Aavash Ganeju';
  const password = 'theaavashh';
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  console.log(`Password updated for ${email}`);

  const { data, error } = await resend.emails.send({
    from: 'RaphArch <info@rapharch.com.au>',
    to: [email],
    subject: 'Your RaphArch Admin Account Credentials',
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Admin Credentials</title></head>
      <body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f4f4f4;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
          <tr><td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
              <tr><td style="background-color:#D4AF37;padding:30px 40px;text-align:center;"><h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:600;">RaphArch</h1></td></tr>
              <tr><td style="padding:40px;">
                <h2 style="color:#1a1a1a;margin:0 0 16px;font-size:20px;">Your Admin Credentials</h2>
                <p style="color:#555555;font-size:15px;line-height:1.6;margin:0 0 24px;">Here are your updated login credentials:</p>
                <table style="width:100%;border-collapse:collapse;margin:20px 0;background-color:#f9f9f9;border-radius:6px;">
                  <tr><td style="padding:12px 16px;border-bottom:1px solid #eee;font-weight:bold;color:#333;width:120px;">Email</td><td style="padding:12px 16px;border-bottom:1px solid #eee;color:#555;">${email}</td></tr>
                  <tr><td style="padding:12px 16px;font-weight:bold;color:#333;">Password</td><td style="padding:12px 16px;color:#555;font-family:monospace;font-size:16px;">${password}</td></tr>
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background-color:#D4AF37;border-radius:6px;"><a href="https://admin.rapharch.com.au" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;border-radius:6px;">Login to Admin</a></td></tr></table>
              </td></tr>
              <tr><td style="background-color:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #eeeeee;"><p style="color:#999999;font-size:12px;margin:0;">&copy; ${new Date().getFullYear()} RaphArch. All rights reserved.</p></td></tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Credentials email sent!', data);
  }

  await prisma.$disconnect();
}

updatePasswordAndSend();
