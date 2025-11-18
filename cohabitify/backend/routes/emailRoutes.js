import express from 'express';
import { sendEmail, testEmail, validateEmail } from '../controllers/emailController.js';

const router = express.Router();

// Test email endpoint (no auth required for testing)
router.get('/test', testEmail);

// Public contact email route (no auth)
router.post('/send', validateEmail, sendEmail);

export default router;