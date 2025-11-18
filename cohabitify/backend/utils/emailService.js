import nodemailer from 'nodemailer';

// Log SMTP configuration
console.log('SMTP Configuration:');
console.log('Host:', process.env.SMTP_HOST);
console.log('Port:', process.env.SMTP_PORT);
console.log('Secure:', process.env.SMTP_SECURE);
console.log('User:', process.env.SMTP_USER);

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false // Only for development, remove in production
  }
});

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server is ready to take our messages');
  }
});

// Send password reset email
export const sendPasswordResetEmail = async (to, resetUrl) => {
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'Cohabify'}" <${process.env.EMAIL_FROM_ADDRESS || 'noreply@cohabify.com'}>`,
    to,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset Your Password</h2>
        <p>You've requested to reset your password. Click the button below to set a new password:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; 
                    color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Reset Password
          </a>
        </p>
        <p>If you didn't request this, please ignore this email. This link will expire in 1 hour.</p>
        <p>Or copy and paste this link into your browser:</p>
        <p><code>${resetUrl}</code></p>
        <hr>
        <p style="color: #666; font-size: 0.9em;">
          This email was sent to ${to}. If you have any questions, please contact our support team.
        </p>
      </div>
    `,
    text: `Reset your password by clicking this link: ${resetUrl}\n\nIf you didn't request this, please ignore this email.`
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};
