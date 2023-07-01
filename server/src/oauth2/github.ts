import passport from 'passport';
import express from 'express';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { v4 } from 'uuid';
import argon2 from 'argon2';
import logger from '../utils/logger';
import { context } from '../utils/prismaClient';
import { CONTAINER_PREFIX, GITHUB_CALLBACK_URL } from '../types/constants';
import { blobServiceClient } from '../utils/azureBlobClient';

const githubOauthRouter = express.Router();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await context.prisma.user.findUnique({
        where: {
          githubId: parseInt(profile.id, 10),
        },
      });

      if (!user) {
        logger.debug(
          'github oauth2 user not found, creating new one with the provided github ID',
        );
        user = await context.prisma.user.create({
          data: {
            email: profile.emails[0].value,
            username: profile.username,
            password: await argon2.hash(v4()),
            isEmailConfirmed: true,
            githubId: parseInt(profile.id, 10),
            googleId: null,
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

githubOauthRouter.use(passport.initialize());

githubOauthRouter.get(
  '/auth/github',
  passport.authenticate('github', { session: false, scope: ['user:email'] }),
);

githubOauthRouter.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    session: false,
    scope: ['user:email'],
  }),
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

export default githubOauthRouter;
