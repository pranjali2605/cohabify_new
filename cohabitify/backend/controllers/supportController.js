const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

// Configure transporter from env
// Required env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SUPPORT_TO
function buildTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn('SMTP credentials missing: please set SMTP_USER and SMTP_PASS in .env');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // false for 587 STARTTLS
    requireTLS: port === 587,
    auth: user && pass ? { user, pass } : undefined,
  });
}

async function sendChatEmail({ user, text, subjectPrefix = '[Live Chat]' }) {
  const to = process.env.SUPPORT_TO || 'harshita.g.2k@gmail.com';
  const transporter = buildTransporter();
  await transporter.sendMail({
    from: `Cohabify Chat <${process.env.SMTP_FROM || 'no-reply@cohabify.local'}>`,
    to,
    subject: `${subjectPrefix} ${user ? `From ${user}` : 'New message'}`,
    text: `User: ${user || 'Anonymous'}\n\n${text}`,
  });
}

// Attempt to send; on auth/misconfig fallback to Ethereal test account and return { delivered, previewUrl }
async function sendMailWithFallback({ from, to, subject, text, replyTo }) {
  let delivered = true;
  let previewUrl = null;
  try {
    const transporter = buildTransporter();
    await transporter.sendMail({ from, to, subject, text, replyTo });
  } catch (err) {
    delivered = false;
    const msg = (err && err.message) || String(err);
    // Fallback to Ethereal for development preview
    try {
      const testAccount = await nodemailer.createTestAccount();
      const ethTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      const info = await ethTransporter.sendMail({ from, to, subject, text, replyTo });
      previewUrl = nodemailer.getTestMessageUrl(info);
      console.warn('Primary SMTP failed, sent via Ethereal preview instead:', msg, 'Preview:', previewUrl);
    } catch (ethErr) {
      console.error('Ethereal fallback failed:', ethErr?.message || ethErr);
    }
  }
  return { delivered, previewUrl };
}

async function contact(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const {
      name,
      email,
      subject,
      message,
    } = req.body;

    const to = process.env.SUPPORT_TO || 'harshita.g.2k@gmail.com';
    const { delivered, previewUrl } = await sendMailWithFallback({
      from: `Cohabify Support <${process.env.SMTP_FROM || 'no-reply@cohabify.local'}>`,
      to,
      subject: `[Contact] ${subject || 'New message'} from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    });

    return res.status(200).json({ message: 'Message accepted', delivered, previewUrl });
  } catch (error) {
    console.error('Support contact error (soft-fail):', error);
    return res.status(200).json({ message: 'Message accepted', delivered: false });
  }
}

async function chat(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { user, text } = req.body; // user: optional identifier
    const to = process.env.SUPPORT_TO || 'harshita.g.2k@gmail.com';
    const { delivered, previewUrl } = await sendMailWithFallback({
      from: `Cohabify Chat <${process.env.SMTP_FROM || 'no-reply@cohabify.local'}>`,
      to,
      subject: `[Live Chat] ${user ? `From ${user}` : 'New message'}`,
      text: `User: ${user || 'Anonymous'}\n\n${text}`,
    });

    return res.status(200).json({ message: 'Chat message accepted', delivered, previewUrl });
  } catch (error) {
    // Absolute fallback: still accept to avoid frontend error UX
    console.error('Support chat error (soft-fail):', error);
    return res.status(200).json({ message: 'Chat message accepted', delivered: false });
  }
}

module.exports = { contact, chat, sendChatEmail };
// Verify SMTP transport configuration
async function verify(req, res) {
  try {
    const transporter = buildTransporter();
    const result = await transporter.verify();
    return res.status(200).json({ ok: true, result });
  } catch (error) {
    return res.status(200).json({ ok: false, error: error?.message || String(error) });
  }
}

module.exports.verify = verify;
