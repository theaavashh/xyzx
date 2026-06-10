require('dotenv').config();
const nodemailer = require('nodemailer');

const smtpHost = process.env.SMTP_HOST || 'smtp.zoho.com.au';
const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
const smtpUser = process.env.SMTP_USER || 'info@rapharch.com.au';
const smtpPass = process.env.SMTP_PASS || 'HC9mLtCx#ZN6BkLS';

console.log('📧 Testing SMTP connection...');
console.log(`Host: ${smtpHost}`);
console.log(`Port: ${smtpPort}`);
console.log(`User: ${smtpUser}`);

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP connection failed:', error.message);
    console.log('\n💡 Common SMTP hosts for Zoho Mail:');
    console.log('   - smtp.zoho.com.au (Australia)');
    console.log('   - smtp.zoho.com (Global)');
    console.log('   - smtp.zoho.eu (Europe)');
    console.log('   - smtp.zoho.in (India)');
    console.log('\n💡 Check your email provider settings for:');
    console.log('   - Outgoing Server (SMTP)');
    console.log('   - Port: 465 (SSL) or 587 (TLS)');
  } else {
    console.log('✅ SMTP connection successful!');
  }
  process.exit(error ? 1 : 0);
});
