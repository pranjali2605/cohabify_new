import crypto from 'crypto';
import User from '../models/User.js';
import PasswordResetToken from '../models/PasswordResetToken.js';
import { sendPasswordResetEmail } from '../utils/emailService.js';

// Generate a secure random token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Request password reset
export const requestPasswordReset = async (req, res) => {
  try {
    console.log('Received password reset request for email:', req.body.email);
    
    // Validate input
    if (!req.body.email) {
      console.log('No email provided');
      return res.status(400).json({
        success: false,
        message: 'Email is required.'
      });
    }

    // Check if FRONTEND_URL is set
    if (!process.env.FRONTEND_URL) {
      console.error('FRONTEND_URL is not set in environment variables');
      throw new Error('Server configuration error');
    }
    
    // Find user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log('No user found with this email');
      // Don't reveal if email exists or not for security
      return res.json({ 
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    console.log('User found, generating reset token...');

    // Delete any existing reset tokens for this user
    await PasswordResetToken.deleteMany({ userId: user._id });

    // Create new reset token
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    console.log('Creating password reset token...');
    await PasswordResetToken.create({
      userId: user._id,
      token,
      expiresAt
    });

    // Send password reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    console.log('Sending password reset email to:', user.email);
    console.log('Reset URL:', resetUrl);
    
    try {
      await sendPasswordResetEmail(user.email, resetUrl);
      console.log('Password reset email sent successfully');
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      throw new Error('Failed to send password reset email');
    }

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while processing your request.'
    });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Find the token
    const resetToken = await PasswordResetToken.findOne({ token })
      .populate('userId');

    if (!resetToken || !resetToken.userId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token.'
      });
    }

    // Check if token is expired
    if (new Date() > resetToken.expiresAt) {
      await PasswordResetToken.deleteOne({ _id: resetToken._id });
      return res.status(400).json({
        success: false,
        message: 'Token has expired. Please request a new password reset.'
      });
    }

    // Update user's password
    const user = resetToken.userId;
    user.password = newPassword;
    await user.save();

    // Delete the used token
    await PasswordResetToken.deleteOne({ _id: resetToken._id });

    res.json({
      success: true,
      message: 'Password has been reset successfully.'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while resetting your password.'
    });
  }
};

export default {
  requestPasswordReset,
  resetPassword
};
