import nodemailer from 'nodemailer';
import { body, validationResult } from 'express-validator';

// Validation rules
export const validateEmail = [
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

const sendEmail = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { fullName, email, subject, message } = req.body;

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Email options
  const mailOptions = {
    from: `"${fullName}" <${process.env.SMTP_USER}>`,
    to: process.env.SUPPORT_TO,
    replyTo: email,
    subject: `New Contact Form: ${subject}`,
    text: `
      You have received a new message from your website contact form.
      
      ========================
      Name: ${fullName}
      Email: ${email}
      Subject: ${subject}
      ========================
      
      Message:
      ${message}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>New Contact Form Submission</h2>
        <p>You have received a new message from your website contact form.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #4CAF50; margin: 15px 0;">
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <p style="margin-top: 20px; color: #666; font-size: 0.9em;">
          This email was sent from your website's contact form.
        </p>
      </div>
    `
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully!'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export { sendEmail };
