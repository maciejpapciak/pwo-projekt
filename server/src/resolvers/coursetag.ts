import { ApolloError } from 'apollo-server-errors';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import {
  CreateCourseTagInput,
  UpdateCourseTagInput,
  DeleteCourseTagInput,
  CourseTag,
} from '../entities/CourseTag';
import { ServerContext } from '../types/customTypes';
import logger from '../utils/logger';

@Resolver(CourseTag)
export class CourseTagResolver {
  @Query(() => [CourseTag])
  async RetrieveCourseTags(
    /*
    Functions that retrieves all categories
    */
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<CourseTag[] | null> {
    try {
      const courseTagCollection = await ctx.prisma.courseTag.findMany();
      return courseTagCollection;
    } catch (err) {
      logger.error(err);
      throw new ApolloError(err);
    }
  }

  @Mutation(() => CourseTag)
  async createCourseTag(
    @Arg('options', () => CreateCourseTagInput)
    options: CreateCourseTagInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<CourseTag | null> {
    try {
      const newCourseTag = await ctx.prisma.courseTag.create({
        data: {
          courseId: options.courseId,
          tagId: options.tagId,
        },
      });
      return newCourseTag;
    } catch (err) {
      logger.error(err);
      throw new ApolloError(err);
    }
  }

  @Mutation(() => CourseTag)
  async updateCourseTag(
    @Arg('options', () => UpdateCourseTagInput) options: UpdateCourseTagInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<CourseTag | null> {
    try {
      const updatedCourseTag = await ctx.prisma.courseTag.update({
        where: { id: options.id || undefined },
        data: {
          courseId: options.courseId,
          tagId: options.tagId,
        },
      });
      return updatedCourseTag;
    } catch (err) {
      logger.error(err);
      throw new ApolloError(err);
    }
  }

  @Mutation(() => CourseTag)
  async deleteCourseTag(
    @Arg('options', () => DeleteCourseTagInput) options: DeleteCourseTagInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<CourseTag | null> {
    try {
      const deletedCourseTag = await ctx.prisma.courseTag.delete({
        where: {
          id: options.id,
        },
      });
      return deletedCourseTag;
    } catch (err) {
      logger.error(err);
      throw new ApolloError(err);
    }
  }
}
