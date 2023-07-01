import Stripe from 'stripe';

export const stripeClient = new Stripe(process.env.STRIPE_SECRETKEY, {
  apiVersion: '2020-08-27',
  telemetry: false,
  typescript: true,
});
