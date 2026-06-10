import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  changePassword,
  forgotPassword,
  generateTotpSecret,
  getProfile,
  login,
  loginWithTotp,
  logout,
  refreshAccessToken,
  resetPassword,
  signup,
  verifyCredentials,
  verifyOtp,
  verifyTotpSetup,
  disableTotp,
} from '../controllers/auth.controller';
import { validate } from '../middlewares/validation';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  otpSchema,
  resetPasswordSchema,
  signupSchema,
  verifyCredentialsSchema,
  verifyTotpSchema,
  loginWithTotpSchema,
  disableTotpSchema,
  totpSetupSchema,
} from '../dto/auth.dto';

const router: Router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many OTP requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many password reset attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many refresh attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', validate(loginSchema), login);
router.post('/verify-otp', validate(otpSchema), verifyOtp);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.post('/signup', validate(signupSchema), signup);
router.get('/profile', getProfile);
router.post('/verify-credentials', validate(verifyCredentialsSchema), verifyCredentials);
router.post('/logout', logout);
router.post('/refresh', refreshAccessToken);
router.post('/generate-totp', validate(totpSetupSchema), generateTotpSecret);
router.post('/verify-totp', validate(verifyTotpSchema), verifyTotpSetup);
router.post('/login-with-totp', validate(loginWithTotpSchema), loginWithTotp);
router.post('/disable-totp', validate(disableTotpSchema), disableTotp);
router.post('/change-password', validate(changePasswordSchema), changePassword);
router.get('/test', (_req, res) => {
  res.json({ message: 'Auth test endpoint working' });
});

export default router;
