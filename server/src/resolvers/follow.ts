import { ApolloError } from 'apollo-server-express';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import {
  CreateFollowInput,
  UpdateFollowInput,
  DeleteFollowInput,
  Follow,
} from '../entities/Follow';
import { ServerContext } from '../types/customTypes';
import logger from '../utils/logger';

@Resolver(Follow)
export class FollowResolver {
  @Query(() => [Follow])
  async retrieveFollows(
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Follow[] | null> {
    try {
      const followCollection = await ctx.prisma.follow.findMany();
      return followCollection;
    } catch (err) {
      logger.error('error in retrieveFollows()');
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Follow)
  async createFollow(
    @Arg('options', () => CreateFollowInput)
    options: CreateFollowInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Follow | null> {
    try {
      const newFollow = await ctx.prisma.follow.create({
        data: {
          userId: options.userId,
          courseId: options.courseId,
        },
      });
      return newFollow;
    } catch (err) {
      logger.error('error in createFollow()');
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Follow)
  async updateFollow(
    @Arg('options', () => UpdateFollowInput) options: UpdateFollowInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Follow | null> {
    try {
      const updatedFollow = await ctx.prisma.follow.update({
        where: { id: options.id || undefined },
        data: {
          userId: options.userId,
          courseId: options.courseId,
        },
      });
      return updatedFollow;
    } catch (err) {
      logger.error('error in updateFollow()');
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Follow)
  async deleteFollow(
    @Arg('options', () => DeleteFollowInput) options: DeleteFollowInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Follow | null> {
    try {
      const deletedFollow = await ctx.prisma.follow.delete({
        where: {
          id: options.id,
        },
      });
      return deletedFollow;
    } catch (err) {
      logger.error('error in deleteFollow()');
      throw new ApolloError(err);
    }
  }
}
