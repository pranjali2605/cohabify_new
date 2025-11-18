import { body, validationResult } from 'express-validator';
import { sendEmail } from '../utils/emailService.js';

// Validation rules
const validateEmail = [
  body('fullName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long')
    .escape(),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('subject')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Subject must be at least 5 characters long')
    .escape(),
  body('message')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Message must be at least 10 characters long')
    .escape()
];

// Send email
const sendEmailHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, subject, message } = req.body;

  try {
    // Send email to support
    await sendEmail(
      process.env.SUPPORT_TO || 'harshita.g.2k@gmail.com',  // recipient (your inbox)
      `Contact Form: ${subject}`,
      `New message from ${fullName} (${email}):\n\n${message}`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #6d28d9; margin-top: 0;">New Contact Form Submission</h2>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: #f9fafb; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 0.875rem;">
            This email was sent from the contact form on your website.
          </p>
        </div>
      `,
      email
    );

    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully'
    });
  } catch (error) {
    console.error('❌ Error sending contact form email:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to send email. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const testEmail = async (req, res) => {
  try {
    await sendEmail(
      'harshita.g.2k@gmail.com',
      'Test Email from Cohabitify',
      'This is a test email from your application.',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6d28d9;">Test Email from Cohabitify</h2>
          <p>Hello,</p>
          <p>This is a test email to verify that your SMTP configuration is working correctly.</p>
          <p>If you're receiving this email, your email setup is working!</p>
          <p>Current time: ${new Date().toLocaleString()}</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 0.875rem;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `
    );

    res.status(200).json({ 
      success: true, 
      message: 'Test email sent successfully'
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send test email',
      error: error.message
    });
  }
};

// Export all functions at the bottom
export { sendEmailHandler as sendEmail, testEmail, validateEmail };