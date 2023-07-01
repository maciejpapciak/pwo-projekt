import express from 'express';
import githubOauthRouter from './github';
import googleOauthRouter from './google';

const oauthRouter = express.Router();

oauthRouter.use(githubOauthRouter);
oauthRouter.use(googleOauthRouter);

export default oauthRouter;
