import { ApolloError } from 'apollo-server-express';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import {
  Library,
  CreateLibraryInput,
  UpdateLibraryInput,
  DeleteLibraryInput,
} from '../entities/Library';
import { ServerContext } from '../types/customTypes';
import logger from '../utils/logger';

@Resolver(Library)
export class LibraryResolver {
  @Query(() => [Library])
  async retrieveLibraries(
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Library[] | null> {
    try {
      const libraryCollection = await ctx.prisma.library.findMany();
      return libraryCollection;
    } catch (err) {
      logger.error('error in retrieveLibraries()');
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Library)
  async createLibrary(
    @Arg('options', () => CreateLibraryInput)
    options: CreateLibraryInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Library | null> {
    try {
      const newLibrary = await ctx.prisma.library.create({
        data: {
          title: options.title,
          chapterId: options.chapterId,
          duration: options.duration,
          path: options.path,
        },
      });
      return newLibrary;
    } catch (err) {
      logger.error('error in createLibrary()');
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Library)
  async updateLibrary(
    @Arg('options', () => UpdateLibraryInput) options: UpdateLibraryInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Library | null> {
    try {
      const updatedLibrary = await ctx.prisma.library.update({
        where: { id: options.id || undefined },
        data: {
          title: options.title,
          chapterId: options.chapterId,
          duration: options.duration,
          path: options.path,
        },
      });
      return updatedLibrary;
    } catch (err) {
      logger.error('error in updateLibrary()');
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Library)
  async deleteLibrary(
    @Arg('options', () => DeleteLibraryInput) options: DeleteLibraryInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Library | null> {
    try {
      const deletedLibrary = await ctx.prisma.library.delete({
        where: {
          id: options.id,
        },
      });
      return deletedLibrary;
    } catch (err) {
      logger.error('error in deleteLibrary()');
      throw new ApolloError(err);
    }
  }
}
