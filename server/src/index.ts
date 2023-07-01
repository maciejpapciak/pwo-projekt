import 'reflect-metadata';
import { applyMiddleware } from 'graphql-middleware';
import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import { buildSchema } from 'type-graphql';
import rateLimit from 'express-rate-limit';
import depthLimit from 'graphql-depth-limit';
import { graphqlUploadExpress } from 'graphql-upload';
import { IS_PROD, COOKIE_NAME } from './types/constants';
import { ServerContext } from './types/customTypes';
import logger from './utils/logger';
import { context } from './utils/prismaClient';
import { redis } from './utils/redis';
import { permissions } from './permissions/permissions';
import { allResolvers } from './resolvers';
// import oauthRouter from './oauth2';
import stripeRouter from './stripe/stripeEventHandler';

const main = async (): Promise<void> => {
  const app = express();
  const RedisStore = connectRedis(session);

  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ): void => {
      if (req.originalUrl === '/webhook') {
        next();
      } else {
        express.json()(req, res, next);
      }
    },
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: 'lax',
        secure: IS_PROD,
      },
      saveUninitialized: false,
      resave: false,
      secret: process.env.SESSION_SECRET,
    }),
  );

  app.set('trust proxy', 1);

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
  );

  const apolloServer = new ApolloServer({
    schema: applyMiddleware(
      await buildSchema({
        resolvers: [...allResolvers],
        authMode: 'null',
        validate: true,
      }),
      permissions,
    ),
    uploads: false,
    validationRules: [depthLimit(10)],
    context: ({ req, res }): ServerContext => ({ req, res, context, redis }),
    playground: {
      settings: {
        'request.credentials': 'include',
      },
    },
  });

  app.use(
    rateLimit({
      windowMs: 1000 * 60 * 15,
      max: 500,
    }),
  );

  app.use(
    graphqlUploadExpress({
      maxFileSize: 1_073_741_824,
      maxFiles: 10,
    }),
  );

  // app.use(oauthRouter);

  app.use(stripeRouter);

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(parseInt(process.env.PORT, 10), () => {
    logger.info(
      `server started on port => ${process.env.PORT}${apolloServer.graphqlPath}`,
    );
  });
};

main()
  .catch((err) => {
    logger.error(err);
    throw new Error(err);
  })
  .finally(async () => {
    await context.prisma.$disconnect();
  });
