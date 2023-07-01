import express from 'express';
import Stripe from 'stripe';
import logger from '../utils/logger';
import { context } from '../utils/prismaClient';
import { stripeClient } from '../utils/stripeClient';

const stripeRouter = express.Router();

let event: Stripe.Event;

export const fulfillOrder = async (xd) => xd;

stripeRouter.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req: express.Request, res: express.Response): Promise<void> => {
    const sig = req.headers['stripe-signature'];
    try {
      event = stripeClient.webhooks.constructEvent(
        req.body,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      logger.error('error in stripe webhook');
      res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session: any = event.data.object;
      console.log({ session });
      const ids = session.client_reference_id.split('_');

      await context.prisma.$queryRaw(`
        INSERT INTO "order" (user_id, course_id) VALUES (${ids[0]}, ${ids[1]})
      `);
    }

    res.status(200).end();
  },
);

export default stripeRouter;
