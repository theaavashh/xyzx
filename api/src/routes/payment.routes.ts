import express, { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticateToken } from '../middlewares/auth';
import {
  createPaymentIntent,
  confirmPaymentIntent,
  createSetupIntent,
  createCustomer,
  getPaymentMethods,
  handleWebhook,
} from '../controllers/payment.controller';

const router: Router = Router();

const paymentIntentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, message: 'Too many payment requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

router.post(
  '/create-payment-intent',
  authenticateToken,
  paymentIntentLimiter,
  createPaymentIntent
);

router.get(
  '/confirm/:paymentIntentId',
  authenticateToken,
  confirmPaymentIntent
);

router.post(
  '/setup-intent',
  authenticateToken,
  createSetupIntent
);

router.post(
  '/customer',
  authenticateToken,
  createCustomer
);

router.get(
  '/customers/:customerId/payment-methods',
  authenticateToken,
  getPaymentMethods
);

export default router;