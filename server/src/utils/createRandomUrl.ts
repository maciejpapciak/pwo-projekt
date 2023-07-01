import { v4 } from 'uuid';
import {
  CONFIRM_EMAIL_PREFIX,
  FORGET_EMAIL_PREFIX,
  FORGET_PASSWORD_PREFIX,
} from '../types/constants';
import { UrlUtilEnumType } from '../types/customTypes';
import logger from './logger';
import { redis } from './redis';

export const createRandomUrl = async (
  userId: number,
  type: UrlUtilEnumType,
): Promise<string | null> => {
  const uuidv4Token = v4();
  switch (type) {
    case UrlUtilEnumType.RegisterEmail:
      await redis.set(
        CONFIRM_EMAIL_PREFIX + uuidv4Token,
        userId,
        'ex',
        1000 * 60 * 60 * 24,
      );
      return `http://localhost:3000/verify/${uuidv4Token}`;
    case UrlUtilEnumType.ChangePasswordEmail:
      await redis.set(
        FORGET_PASSWORD_PREFIX + uuidv4Token,
        userId,
        'ex',
        1000 * 60 * 60 * 24,
      );
      return `http://localhost:3000/changePassword/${uuidv4Token}`;
    case UrlUtilEnumType.ChangeEmail:
      await redis.set(
        FORGET_EMAIL_PREFIX + uuidv4Token,
        userId,
        'ex',
        1000 * 60 * 60 * 24,
      );
      return `http://localhost:3000/changeEmail/${uuidv4Token}`;
    default:
      logger.debug('error in createRandomUrl()');
      return null;
  }
};
