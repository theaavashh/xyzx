import { prisma } from '../lib/database';
import { logger } from '../utils/logger';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

const defaultAdmins = [
  {
    email: process.env.ADMIN_EMAIL || 'aavash.ganeju@gmail.com',
    password: process.env.ADMIN_PASSWORD || 'theaavashh',
    name: process.env.ADMIN_NAME || 'Admin',
  },
  {
    email: 'work.aavashh@gmail.com',
    password: process.env.ADMIN_PASSWORD || 'theaavashh',
    name: 'Aavash Ganeju',
  },
  {
    email: 'sabrina_thapalia@hotmail.com',
    password: 'sabrinathapaliya',
    name: 'Sabrina Thapaliya',
  },
  {
    email: 'maptech07@gmail.com',
    password: 'maptech07',
    name: 'MapTech',
  },
];

export const autoCreateAdmin = async (): Promise<void> => {
  try {
    for (const { email, password, name } of defaultAdmins) {
      const existing = await prisma.user.findUnique({ where: { email } });

      if (existing) {
        if (existing.role !== 'admin') {
          await prisma.user.update({
            where: { email },
            data: { role: 'admin', isActive: true },
          });
          logger.info('User updated to admin', { email });
        } else {
          logger.info('Admin user already exists', { email });
        }
        continue;
      }

      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash(password, 10);

      const admin = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'admin',
          isActive: true,
        },
      });

      logger.info('Admin user auto-created', {
        email: admin.email,
        role: admin.role,
      });

      const { data, error } = await resend.emails.send({
        from: 'RaphArch <info@rapharch.com.au>',
        to: [email],
        subject: 'Your RaphArch Admin Account Credentials',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Admin Account Created</title>
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
                        Your admin account has been created successfully. Here are your login credentials:
                      </p>
                      <table style="width:100%;border-collapse:collapse;margin:20px 0;background-color:#f9f9f9;border-radius:6px;">
                        <tr>
                          <td style="padding:12px 16px;border-bottom:1px solid #eee;font-weight:bold;color:#333;width:120px;">Email</td>
                          <td style="padding:12px 16px;border-bottom:1px solid #eee;color:#555;">${email}</td>
                        </tr>
                        <tr>
                          <td style="padding:12px 16px;font-weight:bold;color:#333;">Password</td>
                          <td style="padding:12px 16px;color:#555;font-family:monospace;font-size:16px;">${password}</td>
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
        logger.error('Failed to send credentials email', { email }, error);
      } else {
        logger.info('Credentials email sent successfully', { email, messageId: data?.id });
      }
    }
  } catch (error) {
    logger.error('Failed to auto-create admin user', { emails: defaultAdmins.map(a => a.email) }, error as Error);
  }
};

if (require.main === module) {
  autoCreateAdmin()
    .then(() => prisma.$disconnect())
    .catch((err) => {
      console.error('Auto-create admin failed:', err);
      prisma.$disconnect().then(() => process.exit(1));
    });
}
