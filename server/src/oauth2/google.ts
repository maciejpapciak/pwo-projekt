import passport from 'passport';
import express from 'express';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import argon2 from 'argon2';
import { v4 } from 'uuid';
import { CONTAINER_PREFIX, GOOGLE_CALLBACK_URL } from '../types/constants';
import logger from '../utils/logger';
import { context } from '../utils/prismaClient';
import { blobServiceClient } from '../utils/azureBlobClient';

const googleOauthRouter = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
      scope: ['profile', 'email'],
    },
    async (_request, accessToken, refreshToken, profile: any, done) => {
      let user = await context.prisma.user.findUnique({
        where: {
          googleId: profile.id,
        },
      });

      if (!user) {
        logger.debug(
          'google oauth2 user not found, creating new one with the provided github ID',
        );
        user = await context.prisma.user.create({
          data: {
            email: profile.emails[0].value,
            username: profile.displayName,
            password: await argon2.hash(v4()),
            isEmailConfirmed: true,
            githubId: null,
            googleId: profile.id,
          },
        });

        try {
          await blobServiceClient.createContainer(
            `${CONTAINER_PREFIX}${user.id}`,
            {
              access: 'blob',
            },
          );
        } catch (err) {
          logger.error(err);
        }
      }

      done(null, {
        user,
        permissionLevel: user.permissionLevel,
        accessToken,
        refreshToken,
      });
    },
  ),
);

googleOauthRouter.use(passport.initialize());

googleOauthRouter.get(
  '/auth/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  }),
);

googleOauthRouter.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false }),
  async (req: any, res) => {
    if (req.user?.user.id && req.session) {
      req.session.userId = req.user.user.id;
      req.session.permissionLevel = req.user.permissionLevel;
      req.session.accessToken = req.user.accessToken;
      req.session.refreshToken = req.user.refreshToken;
      res.redirect(process.env.CORS_ORIGIN || 'http://localhost:3000/');
    }
  },
);

export default googleOauthRouter;
