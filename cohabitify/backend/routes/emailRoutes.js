import express from 'express';
import { sendEmail, validateEmail } from '../controllers/emailController.js';

const router = express.Router();

// POST /api/email/send
router.post('/send', validateEmail, sendEmail);

export default router;
