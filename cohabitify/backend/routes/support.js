import express from 'express';
import { body } from 'express-validator';
import { contact, chat, verify } from '../controllers/supportController.js';

const router = express.Router();

// POST /api/support/contact
router.post(
  '/contact',
  [
    body('name').trim().isString().isLength({ min: 2, max: 100 }),
    body('email').trim().isEmail().normalizeEmail(),
    body('subject').optional({ checkFalsy: true }).trim().isString().isLength({ max: 150 }),
    body('message').trim().isString().isLength({ min: 5, max: 5000 }),
  ],
  contact
);

// POST /api/support/chat
router.post(
  '/chat',
  [
    body('user').optional({ checkFalsy: true }).trim().isString().isLength({ min: 1, max: 100 }),
    body('text').trim().isString().isLength({ min: 1, max: 2000 }),
  ],
  chat
);

// Diagnostic: verify SMTP configuration
router.get('/verify', verify);

export default router;
// Diagnostic: verify SMTP configuration
router.get('/verify', verify);
