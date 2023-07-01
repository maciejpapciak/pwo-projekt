import { ApolloError } from 'apollo-server-express';
import argon2 from 'argon2';
import { GraphQLEmailAddress, GraphQLJSON } from 'graphql-scalars';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { UserResponse } from '../entities/CustomError';
import {
  ChangeEmailInput,
  ChangePasswordInput,
  UpdateEmailInput,
  UpdateUserMetaInfoInput,
  User,
  UserLoginInput,
  UserRegisterInput,
} from '../entities/User';
import {
  CONFIRM_EMAIL_PREFIX,
  CONTAINER_PREFIX,
  COOKIE_NAME,
  FORGET_EMAIL_PREFIX,
  FORGET_PASSWORD_PREFIX,
} from '../types/constants';
import { ServerContext, UrlUtilEnumType } from '../types/customTypes';
import { blobServiceClient } from '../utils/azureBlobClient';
import { createRandomUrl } from '../utils/createRandomUrl';
import logger from '../utils/logger';
import { sendEmail } from '../utils/sendEmail';

@Resolver()
export class UserResolver {
  @Query(() => [User], { nullable: true })
  async users(@Ctx() { context: ctx }: ServerContext): Promise<User[] | null> {
    try {
      const users = await ctx.prisma.user.findMany();
      return users;
    } catch (err) {
      throw new ApolloError(err);
    }
  }

  @Query(() => User, { nullable: true })
  async userById(
    @Arg('id', () => Int) id: number,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<User | null> {
    try {
      const user = await ctx.prisma.user.findUnique({ where: { id } });
      return user;
    } catch (err) {
      logger.error('error in userById()');
      throw new ApolloError(err);
    }
  }

  @Query(() => GraphQLJSON)
  async userStats(
    @Arg('id', () => Int) id: number,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<User | null> {
    try {
      const userStats = await ctx.prisma.$queryRaw(`
          SELECT COUNT("course".id) as course_amount,
      (
        SELECT COUNT(DISTINCT "order".user_id)
        FROM "order"
        JOIN "course"
        ON "order".course_id = "course".id
        WHERE "course".author_id = ${id}

      ) as number_of_students,

      (
        SELECT ROUND(COALESCE(AVG("rating".amount),0),2)
        FROM "rating"
        JOIN "course"
        ON "rating".course_id = "course".id
        WHERE "course".author_id = ${id}

      ) as average_rating
      FROM "course"
      WHERE "course".author_id = ${id}
    `);
      const roundedRating = Math.round(userStats[0].average_rating * 100) / 100;
      userStats[0].average_rating = roundedRating;
      return userStats;
    } catch (err) {
      logger.error('error in userStats');
      throw new ApolloError(err);
    }
  }

  @Mutation(() => User)
  async register(
    @Arg('options', () => UserRegisterInput)
    options: UserRegisterInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<User | UserResponse | ApolloError> {
    const hashedPassword = await argon2.hash(options.password);

    if (!hashedPassword) {
      logger.error('error in register()');
      return {
        errors: [
          {
            field: 'hashed password',
            message: 'could not hash password',
          },
        ],
      };
    }

    const user = await ctx.prisma.user.create({
      data: {
        firstName: options.firstName,
        lastName: options.lastName,
        username: options.username,
        email: options.email,
        password: hashedPassword,
      },
    });

    if (!user) {
      logger.error('error in registerUser()');
      return new ApolloError('could not create a user');
    }

    await sendEmail(
      options.email,
      'Verify your account now!',
      `<a href="${await createRandomUrl(
        user.id,
        UrlUtilEnumType.RegisterEmail,
      )}">verify!</a>`,
    );

    logger.debug('email has been sent');

    try {
      await blobServiceClient.createContainer(`${CONTAINER_PREFIX}${user.id}`, {
        access: 'blob',
      });
    } catch (err) {
      throw new ApolloError(err);
    }

    return user;
  }

  @Mutation(() => Boolean)
  async verify(
    @Arg('uuidv4Token', () => String) uuidv4Token: string,
    @Ctx() { context: ctx, redis }: ServerContext,
  ): Promise<boolean | ApolloError> {
    const userId = await redis.get(CONFIRM_EMAIL_PREFIX + uuidv4Token);

    if (!userId) {
      logger.error('error in verifyUser()');
      return new ApolloError('bad token or token has expired');
    }

    const user = await ctx.prisma.user.update({
      where: {
        id: parseInt(userId, 10),
      },
      data: {
        isEmailConfirmed: true,
      },
    });

    if (!user) {
      logger.error('error in verify()');
      return new ApolloError('could not update the user');
    }

    await redis.del(CONFIRM_EMAIL_PREFIX + uuidv4Token);

    return true;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options', () => UserLoginInput)
    options: UserLoginInput,
    @Ctx()
    { req, context: ctx }: ServerContext,
  ): Promise<UserResponse | User | ApolloError> {
    const user = await ctx.prisma.user.findUnique({
      where: {
        email: options.email,
      },
    });

    if (!user) {
      logger.error('error in loginUser()');
      return new ApolloError('error while looking for a valid user');
    }

    if (user.isEmailConfirmed === false) {
      logger.error('error in login()');
      return {
        errors: [
          {
            field: 'email',
            message: 'email has not been confirmed',
          },
        ],
      };
    }

    const isValid = await argon2.verify(user?.password ?? '', options.password);

    if (!isValid) {
      logger.error('error in loginUser()');
      return {
        errors: [
          {
            field: 'password',
            message: 'incorrect password',
          },
        ],
      };
    }

    req.session.userId = user?.id;
    req.session.permissionLevel = user?.permissionLevel;

    return { user };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: ServerContext) {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          logger.error(err);
          resolve(false);
          return;
        }
        resolve(true);
      });
    });
  }

  @Mutation(() => User, { nullable: true })
  async isMe(@Ctx() { req, context: ctx }: ServerContext) {
    if (!req.session.userId) {
      logger.error('error in isMe()');
      return null;
    }

    const user = await ctx.prisma.user.findUnique({
      where: {
        id: req.session.userId,
      },
    });

    return user;
  }

  @Mutation(() => UserResponse)
  async forgotPassword(
    @Arg('email', () => GraphQLEmailAddress) email: string,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<UserResponse | boolean | null> {
    const user = await ctx.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      logger.error('error in forgotPassword()');
      return {
        errors: [
          {
            field: 'email',
            message: 'user with given email does not exist',
          },
        ],
      };
    }

    await sendEmail(
      email,
      'Change your password!',
      `<a href="${await createRandomUrl(
        user.id,
        UrlUtilEnumType.ChangePasswordEmail,
      )}">reset your password now!</a>`,
    );
    logger.debug('email has been sent');

    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('options', () => ChangePasswordInput)
    options: ChangePasswordInput,
    @Ctx() { context: ctx, redis }: ServerContext,
  ): Promise<UserResponse | User | ApolloError> {
    const userId = await redis.get(
      FORGET_PASSWORD_PREFIX + options.uuidv4Token,
    );

    if (!userId) {
      logger.error('error in changePassword()');
      return {
        errors: [
          {
            field: 'token',
            message: 'token expired',
          },
        ],
      };
    }

    const user = await ctx.prisma.user.findUnique({
      where: {
        id: parseInt(userId, 10),
      },
    });

    if (!user) {
      logger.error('error in changePassword()');
      return new ApolloError('error while looking for valid user');
    }

    const updatedUser = await ctx.prisma.user.update({
      where: {
        id: parseInt(userId, 10),
      },
      data: {
        password: await argon2.hash(options.password),
      },
    });

    if (!updatedUser) {
      logger.error('error in changePassword()');
      return new ApolloError('could not update the user');
    }

    return updatedUser;
  }

  @Mutation(() => User)
  async updateUser(
    @Arg('options', () => UpdateUserMetaInfoInput)
    options: UpdateUserMetaInfoInput,
    @Ctx() { context: ctx, req }: ServerContext,
  ): Promise<User> {
    try {
      const updatedUser = ctx.prisma.user.update({
        where: {
          id: req.session.userId,
        },
        data: {
          firstName: options.firstName,
          lastName: options.lastName,
          username: options.username,
          permissionLevel: options.permissionLevel,
        },
      });

      if (!updatedUser) {
        logger.error('error in updateUser()');
        throw new ApolloError('error in updateUser()');
      }

      return updatedUser;
    } catch (err) {
      logger.error(err);
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Boolean)
  async forgotEmail(
    @Arg('options', () => UpdateEmailInput) options: UpdateEmailInput,
    @Ctx() { context: ctx, req }: ServerContext,
  ): Promise<boolean> {
    try {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: req.session.userId,
        },
      });

      const isValid = await argon2.verify(
        user?.password ?? '',
        options.password,
      );

      if (!user || !isValid) {
        logger.error('error in updateEmail()');
        throw new ApolloError('wrong password');
      }

      const updatedUser = await ctx.prisma.user.update({
        where: {
          id: req.session.userId,
        },
        data: {
          email: options.email,
          isEmailConfirmed: false,
        },
      });
      await sendEmail(
        options.email,
        'Verify your new email!',
        `<a href="${await createRandomUrl(
          updatedUser.id,
          UrlUtilEnumType.ChangeEmail,
        )}">verify!</a>`,
      );
      return true;
    } catch (err) {
      logger.error('error in updateEmail()');
      throw new ApolloError(err);
    }
  }

  @Mutation(() => UserResponse)
  async changeEmail(
    @Arg('options', () => ChangeEmailInput) options: ChangeEmailInput,
    @Ctx() { context: ctx, redis }: ServerContext,
  ) {
    const userId = await redis.get(FORGET_EMAIL_PREFIX + options.uuidv4Token);

    if (!userId) {
      logger.error('error in changeEmail()');
      return {
        errors: [
          {
            field: 'token',
            message: 'token expired',
          },
        ],
      };
    }

    const user = await ctx.prisma.user.findUnique({
      where: {
        id: parseInt(userId, 10),
      },
    });

    if (!user) {
      logger.error('error in changeEmail()');
      return new ApolloError('error while looking for valid user');
    }

    const updatedUser = await ctx.prisma.user.update({
      where: {
        id: parseInt(userId, 10),
      },
      data: {
        email: options.email,
        isEmailConfirmed: true,
      },
    });

    if (!updatedUser) {
      logger.error('error in changeEmail()');
      return new ApolloError('could not update the user');
    }

    return updatedUser;
  }
}
