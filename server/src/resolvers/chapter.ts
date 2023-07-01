import { ApolloError } from 'apollo-server-express';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import {
  CreateChapterInput,
  UpdateChapterInput,
  DeleteChapterInput,
  Chapter,
} from '../entities/Chapter';
import { ServerContext } from '../types/customTypes';
import logger from '../utils/logger';

@Resolver(Chapter)
export class ChapterResolver {
  @Query(() => [Chapter])
  async retrieveChapters(
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Chapter[] | null> {
    try {
      const chapterCollection = await ctx.prisma.chapter.findMany();
      return chapterCollection;
    } catch (err) {
      logger.error('error in retrieveChapters()');
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Chapter)
  async createChapter(
    @Arg('options', () => CreateChapterInput, { nullable: true })
    options: CreateChapterInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Chapter | null> {
    try {
      const newChapter = await ctx.prisma.chapter.create({
        data: {
          name: options.name,
          courseId: options.courseId,
          index: options.index,
        },
      });
      return newChapter;
    } catch (err) {
      logger.error('error in createChapter()');
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Chapter)
  async updateChapter(
    @Arg('options', () => UpdateChapterInput) options: UpdateChapterInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Chapter | null> {
    try {
      const updatedChapter = await ctx.prisma.chapter.update({
        where: { id: options.id || undefined },
        data: {
          name: options.name,
          courseId: options.courseId,
        },
      });
      return updatedChapter;
    } catch (err) {
      logger.error('error in updateChapter()');
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Chapter)
  async deleteChapter(
    @Arg('options', () => DeleteChapterInput) options: DeleteChapterInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Chapter | null> {
    try {
      const deletedChapter = await ctx.prisma.chapter.delete({
        where: {
          id: options.id,
        },
      });
      return deletedChapter;
    } catch (err) {
      logger.error('error in deleteChapter()');
      throw new ApolloError(err);
    }
  }
}
