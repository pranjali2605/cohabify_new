import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Resolve SMTP configs from env with sensible defaults
const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpSecure = (process.env.SMTP_SECURE || '').toLowerCase() === 'true' || smtpPort === 465;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

// Validate presence of credentials early to surface a clear error
if (!smtpUser || !smtpPass) {
  console.error('❌ SMTP configuration error: SMTP_USER or SMTP_PASS is missing.');
}

// Minimal masked debug to verify what process sees (non-sensitive)
console.log('ℹ️  SMTP debug:', {
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  userPresent: !!smtpUser,
  userSample: smtpUser ? `${smtpUser.slice(0,2)}***@${smtpUser.split('@')[1]}` : null,
  passLength: smtpPass ? smtpPass.length : 0,
});

// Create a transporter using configured SMTP
const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure, // true for 465, false for other ports
  requireTLS: (process.env.SMTP_REQUIRE_TLS || '').toLowerCase() === 'true',
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

// Verify connection configuration
transporter.verify((error) => {
  if (error) {
    console.error('❌ SMTP connection error:', error.message);
  } else {
    console.log('✅ SMTP server is ready to send emails');
  }
});

// Send email function
export const sendEmail = async (to, subject, text, html, replyTo) => {
  try {
    const info = await transporter.sendMail({
      from: `${process.env.SMTP_FROM || `Cohabitify <${process.env.SMTP_USER || 'no-reply@example.com'}>`}`,
      to,
      subject,
      text,
      html,
      replyTo,
    });
    console.log(`📧 Email sent to: ${to}`);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    // Fallback for development: if authentication fails, use Ethereal
    const isAuthError = error.code === 'EAUTH' || /Invalid login|Missing credentials/i.test(error.message || '');
    const isDev = (process.env.NODE_ENV || 'development') !== 'production';
    if (isAuthError && isDev) {
      try {
        console.warn('⚠️  Falling back to Ethereal test SMTP (development only).');
        const testAccount = await nodemailer.createTestAccount();
        const etherealTransport = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        const info = await etherealTransport.sendMail({
          from: `${process.env.SMTP_FROM || 'Cohabitify <no-reply@example.com>'}`,
          to,
          subject,
          text,
          html,
          replyTo,
        });
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
          console.log(`🔎 Ethereal preview URL: ${previewUrl}`);
        }
        return info;
      } catch (fallbackErr) {
        console.error('❌ Ethereal fallback failed:', fallbackErr.message);
        throw error; // rethrow original authentication error
      }
    }
    throw error;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (to, resetUrl) => {
  try {
    const info = await sendEmail(
      to,
      'Password Reset Request',
      `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6d28d9;">Password Reset Request</h2>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 10px 20px; background-color: #6d28d9; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Reset Password
          </a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 0.875rem;">
            If you didn't request this email, you can safely ignore it.
          </p>
        </div>
      `
    );
    return info;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    throw error;
  }
};

export default transporter;