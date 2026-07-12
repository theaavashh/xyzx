import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// IMPORTANT: Set ADMIN_PASSWORD env var before running this script.
// WARNING: Hardcoded passwords in script files is a security risk.
const adminPassword = process.env.ADMIN_PASSWORD;
if (!adminPassword || adminPassword.length < 8) {
  console.error('ADMIN_PASSWORD environment variable must be set (min 8 characters)');
  process.exit(1);
}

const users = [
  {
    email: 'sabrina_thapalia@hotmail.com',
    name: 'Sabrina Thapalia',
    password: adminPassword,
    role: 'admin',
  },
  {
    email: 'maptech07@gmail.com',
    name: 'Maptech Admin',
    password: adminPassword,
    role: 'admin',
  },
];

async function createUser(user: typeof users[0]) {
  const existing = await prisma.user.findUnique({ where: { email: user.email } });
  if (existing) {
    console.log(`User ${user.email} already exists, skipping.`);
    return existing;
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);
  const created = await prisma.user.create({
    data: {
      email: user.email,
      name: user.name,
      password: hashedPassword,
      role: user.role,
      isActive: true,
    },
  });
  console.log(`Created user: ${user.email} (${user.name})`);
  return created;
}

async function sendCredentialsEmail(user: typeof users[0]) {
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM || 'RaphArch <noreply@rapharch.com>',
    to: [user.email],
    subject: 'Your RaphArch Account Has Been Created',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Created</title>
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
                    <h2 style="color:#1a1a1a;margin:0 0 16px;font-size:20px;">Welcome, ${user.name}!</h2>
                    <p style="color:#555555;font-size:15px;line-height:1.6;margin:0 0 24px;">
                      Your account has been created successfully. Here are your login credentials:
                    </p>
                    <table style="width:100%;border-collapse:collapse;margin:20px 0;background-color:#f9f9f9;border-radius:6px;">
                      <tr>
                        <td style="padding:12px 16px;border-bottom:1px solid #eee;font-weight:bold;color:#333;width:120px;">Email</td>
                        <td style="padding:12px 16px;border-bottom:1px solid #eee;color:#555;">${user.email}</td>
                      </tr>
                      <tr>
                        <td style="padding:12px 16px;border-bottom:1px solid #eee;font-weight:bold;color:#333;">Name</td>
                        <td style="padding:12px 16px;border-bottom:1px solid #eee;color:#555;">${user.name}</td>
                      </tr>
                      <tr>
                        <td style="padding:12px 16px;font-weight:bold;color:#333;">Password</td>
                        <td style="padding:12px 16px;color:#555;font-family:monospace;font-size:16px;">${user.password}</td>
                      </tr>
                    </table>
                    <p style="color:#555555;font-size:15px;line-height:1.6;margin:0 0 24px;">
                      Please log in and change your password immediately for security purposes.
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color:#D4AF37;border-radius:6px;">
                          <a href="https://admin.rapharch.com.au" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;border-radius:6px;">Login to Admin</a>
                        </td>
                      </tr>
                    </table>
                    <p style="color:#888888;font-size:13px;line-height:1.6;margin:24px 0 0;">
                      If you did not request this account, please contact support immediately.
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

  if (error) {
    console.error(`Failed to send email to ${user.email}:`, error);
  } else {
    console.log(`Email sent to ${user.email}`, data);
  }
}

async function main() {
  try {
    for (const user of users) {
      const created = await createUser(user);
      if (created) {
        await sendCredentialsEmail(user);
      }
    }
    console.log('Done.');
  } catch (err) {
    console.error('Script failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
