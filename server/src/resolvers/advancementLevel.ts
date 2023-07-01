import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { ApolloError } from 'apollo-server-express';
import { ServerContext } from '../types/customTypes';
import {
  AdvancementLevel,
  CreateAdvancementLevelInput,
  DeleteAdvancementLevelInput,
  UpdateAdvancementLevelInput,
} from '../entities/AdvancementLevel';
import logger from '../utils/logger';

@Resolver(AdvancementLevel)
export class AdvancementLevelResolver {
  @Query(() => [AdvancementLevel])
  async retrieveAdvancementLevels(
    /*
    Function that retrieves all advancement levels
    */
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<AdvancementLevel[] | null> {
    try {
      const advancementLevelsCollection =
        await ctx.prisma.advancementLevel.findMany({ orderBy: { id: 'asc' } });
      return advancementLevelsCollection;
    } catch (err) {
      throw new ApolloError(err);
    }
  }

  @Mutation(() => AdvancementLevel)
  async createAdvancementLevel(
    @Arg('options', () => CreateAdvancementLevelInput)
    options: CreateAdvancementLevelInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<AdvancementLevel | null> {
    try {
      const newAdvancedLevel = await ctx.prisma.advancementLevel.create({
        data: {
          name: options.name,
        },
      });
      return newAdvancedLevel;
    } catch (err) {
      logger.error(err);
      throw new ApolloError(err);
    }
  }

  @Mutation(() => AdvancementLevel)
  async updateAdvancementLevel(
    @Arg('options', () => UpdateAdvancementLevelInput)
    options: UpdateAdvancementLevelInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<AdvancementLevel | null> {
    try {
      const updatedAdvancementLevel = await ctx.prisma.advancementLevel.update({
        where: { id: options.id || undefined },
        data: {
          name: options.name,
        },
      });
      return updatedAdvancementLevel;
    } catch (err) {
      logger.error(err);
      throw new ApolloError(err);
    }
  }

  @Mutation(() => AdvancementLevel)
  async deleteAdvancementLevel(
    @Arg('options', () => DeleteAdvancementLevelInput)
    options: DeleteAdvancementLevelInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<AdvancementLevel | null> {
    try {
      const deletedAdvancementLevel = await ctx.prisma.advancementLevel.delete({
        where: { id: options.id },
      });
      return deletedAdvancementLevel;
    } catch (err) {
      logger.error(err);
      throw new ApolloError(err);
    }
  }
}
