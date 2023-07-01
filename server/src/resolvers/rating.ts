import { ApolloError } from 'apollo-server-express';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import {
  CreateRatingInput,
  DeleteRatingInput,
  UpdateRatingInput,
  Rating,
} from '../entities/Rating';
import { ServerContext } from '../types/customTypes';
import logger from '../utils/logger';

@Resolver(Rating)
export class RatingResolver {
  @Query(() => [Rating])
  async retrieveRatings(
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Rating[] | null> {
    try {
      const ratingCollection = await ctx.prisma.rating.findMany();
      return ratingCollection;
    } catch (err) {
      logger.error('error in retrieveRatings()');
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Rating)
  async createRating(
    @Arg('options', () => CreateRatingInput)
    options: CreateRatingInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Rating | null> {
    try {
      const newRating = await ctx.prisma.rating.create({
        data: {
          amount: options.amount,
          content: options.content,
          senderId: options.senderId,
          courseId: options.courseId,
        },
      });
      return newRating;
    } catch (err) {
      logger.error('error in createRating()');
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Rating)
  async updateRating(
    @Arg('options', () => UpdateRatingInput) options: UpdateRatingInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Rating | null> {
    try {
      const newRating = await ctx.prisma.rating.update({
        where: {
          id: options.id,
        },
        data: {
          amount: options.amount,
          content: options.content,
          senderId: options.senderId,
        },
      });
      return newRating;
    } catch (err) {
      logger.error('error in updateRating()');
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Rating)
  async deleteRating(
    @Arg('options', () => DeleteRatingInput) options: DeleteRatingInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Rating | null> {
    try {
      const deletedRating = await ctx.prisma.rating.delete({
        where: {
          id: options.id,
        },
      });
      return deletedRating;
    } catch (err) {
      logger.error('error in deleteRating()');
      throw new ApolloError(err);
    }
  }
}
