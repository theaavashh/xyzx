import type { Request, RequestHandler, Response } from 'express';
import Stripe from 'stripe';
import { asyncHandler, sendBadRequest, sendSuccess, sendError } from '../utils';
import { logger } from '../utils/logger';
import { stripeCircuitBreaker } from '../services/circuit-breaker';
import { getStripeConfig } from '../config/env-config';

const getStripeClient = (): Stripe => {
  const config = getStripeConfig();
  
  if (!config.secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  return new Stripe(config.secretKey, {
    apiVersion: '2026-02-25.clover' as any,
  });
};

export const createPaymentIntent: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { amount, currency = 'usd', metadata, customerId } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      sendBadRequest(res, 'Valid amount is required');
      return;
    }

    const stripe = getStripeClient();

    try {
      const paymentIntent = await stripeCircuitBreaker.execute(() =>
        stripe.paymentIntents.create({
          amount: Math.round(amount * 100),
          currency: currency.toLowerCase(),
          metadata: metadata as Record<string, string> | undefined,
          customer: customerId,
          automatic_payment_methods: { enabled: true },
        })
      );

      logger.info('Payment intent created', {
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      });

      sendSuccess(res, {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error) {
      const stripeError = error as Stripe.errors.StripeError;
      logger.error('Failed to create payment intent', undefined, stripeError);
      sendError(res, stripeError.message || 'Failed to create payment intent', 400);
    }
  }
);

export const confirmPaymentIntent: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const paymentIntentId = req.params.paymentIntentId as string;

    if (!paymentIntentId) {
      sendBadRequest(res, 'Payment intent ID is required');
      return;
    }

    const stripe = getStripeClient();

    try {
      const paymentIntent = await stripeCircuitBreaker.execute(() =>
        stripe.paymentIntents.retrieve(paymentIntentId)
      );

      sendSuccess(res, {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      });
    } catch (error) {
      const stripeError = error as Stripe.errors.StripeError;
      logger.error('Failed to retrieve payment intent', { paymentIntentId }, stripeError);
      sendError(res, 'Failed to retrieve payment intent', 400);
    }
  }
);

export const createSetupIntent: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { customerId } = req.body;

    const stripe = getStripeClient();

    try {
      const setupIntent = await stripeCircuitBreaker.execute(() =>
        stripe.setupIntents.create({
          customer: customerId,
          automatic_payment_methods: { enabled: true },
        })
      );

      logger.info('Setup intent created', { setupIntentId: setupIntent.id });

      sendSuccess(res, { clientSecret: setupIntent.client_secret });
    } catch (error) {
      const stripeError = error as Stripe.errors.StripeError;
      logger.error('Failed to create setup intent', undefined, stripeError);
      sendError(res, stripeError.message || 'Failed to create setup intent', 400);
    }
  }
);

export const createCustomer: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, name, metadata } = req.body;

    if (!email) {
      sendBadRequest(res, 'Email is required');
      return;
    }

    const stripe = getStripeClient();

    try {
      const customer = await stripeCircuitBreaker.execute(() =>
        stripe.customers.create({
          email,
          name,
          metadata: metadata as Record<string, string> | undefined,
        })
      );

      logger.info('Stripe customer created', { customerId: customer.id, email });

      sendSuccess(res, {
        customerId: customer.id,
        email: customer.email,
      });
    } catch (error) {
      const stripeError = error as Stripe.errors.StripeError;
      logger.error('Failed to create customer', { email }, stripeError);
      sendError(res, stripeError.message || 'Failed to create customer', 400);
    }
  }
);

export const getPaymentMethods: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const customerId = req.params.customerId as string;

    if (!customerId) {
      sendBadRequest(res, 'Customer ID is required');
      return;
    }

    const stripe = getStripeClient();

    try {
      const paymentMethods = await stripeCircuitBreaker.execute(() =>
        stripe.paymentMethods.list({
          customer: customerId,
          type: 'card',
        })
      );

      sendSuccess(res, {
        paymentMethods: paymentMethods.data.map((pm) => ({
          id: pm.id,
          brand: pm.card?.brand,
          last4: pm.card?.last4,
          expMonth: pm.card?.exp_month,
          expYear: pm.card?.exp_year,
        })),
      });
    } catch (error) {
      const stripeError = error as Stripe.errors.StripeError;
      logger.error('Failed to get payment methods', { customerId }, stripeError);
      sendError(res, 'Failed to retrieve payment methods', 400);
    }
  }
);

export const handleWebhook: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !endpointSecret) {
      logger.warn('Webhook missing signature or secret', {
        hasSignature: !!sig,
        hasSecret: !!endpointSecret,
      });
      sendBadRequest(res, 'Missing stripe signature or webhook secret');
      return;
    }

    let event: Stripe.Event;

    try {
      const stripe = getStripeClient();
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      const error = err as Error;
      logger.error('Webhook signature verification failed', undefined, error);
      sendBadRequest(res, `Webhook Error: ${error.message}`);
      return;
    }

    logger.info('Stripe webhook received', { eventType: event.type, eventId: event.id });

    try {
      switch (event.type) {
        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          logger.info('Payment succeeded', {
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
          });
          break;
        }

        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          logger.warn('Payment failed', {
            paymentIntentId: paymentIntent.id,
            error: paymentIntent.last_payment_error?.message,
          });
          break;
        }

        case 'customer.subscription.created': {
          const subscription = event.data.object as Stripe.Subscription;
          logger.info('Subscription created', {
            subscriptionId: subscription.id,
            customerId: subscription.customer,
          });
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          logger.info('Subscription cancelled', {
            subscriptionId: subscription.id,
            customerId: subscription.customer,
          });
          break;
        }

        case 'invoice.paid': {
          const invoice = event.data.object as Stripe.Invoice;
          logger.info('Invoice paid', {
            invoiceId: invoice.id,
            amount: invoice.amount_paid,
          });
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as Stripe.Invoice;
          logger.warn('Invoice payment failed', {
            invoiceId: invoice.id,
            amount: invoice.amount_due,
          });
          break;
        }

        default:
          logger.debug('Unhandled webhook event type', { eventType: event.type });
      }

      sendSuccess(res, { received: true });
    } catch (error) {
      logger.error('Error processing webhook', { eventType: event.type }, error as Error);
      sendError(res, 'Error processing webhook', 500);
    }
  }
);