import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import { Redis } from 'ioredis';
import { ConnectionOptions } from 'tls';
import { NonEmptyArray } from 'type-graphql';
import { Context } from '../utils/prismaClient';

export type ServerContext = {
  req: Request & {
    session: Session &
      Partial<SessionData> & {
        userId?: number;
        permissionLevel?: number;
      };
  };
  res: Response;
  context: Context;
  redis: Redis;
};

export type TlsType = ConnectionOptions | undefined;

export enum UrlUtilEnumType {
  RegisterEmail,
  ChangePasswordEmail,
  ChangeEmail,
}

export type ResolverCollectionType =
  | NonEmptyArray<Function>
  | NonEmptyArray<string>;

export type RequestOauth2 = {
  req: Request & {
    session: Session &
      Partial<SessionData> & {
        userId?: number | string;
        permissionLevel?: number;
        accessToken?: string;
        refreshToken?: string;
      };
  };
};
