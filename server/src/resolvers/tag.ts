import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { ApolloError } from 'apollo-server-express';
import { ServerContext } from '../types/customTypes';
import {
  Tag,
  CreateTagInput,
  UpdateTagInput,
  DeleteTagInput,
} from '../entities/Tag';

@Resolver(Tag)
export class TagResolver {
  @Query(() => [Tag])
  async RetrieveTags(
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Tag[] | null> {
    try {
      const tagCollection = await ctx.prisma.tag.findMany();
      return tagCollection;
    } catch (err) {
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Tag)
  async createTag(
    @Arg('options', () => CreateTagInput) options: CreateTagInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Tag | null> {
    try {
      const newTag = await ctx.prisma.tag.create({
        data: {
          name: options.name,
        },
      });
      return newTag;
    } catch (err) {
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Tag)
  async updateTag(
    @Arg('options', () => UpdateTagInput) options: UpdateTagInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Tag | null> {
    try {
      const updatedTag = await ctx.prisma.tag.update({
        where: { id: options.id },
        data: {
          name: options.name,
        },
      });
      return updatedTag;
    } catch (err) {
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Tag)
  async deleteTag(
    @Arg('options', () => DeleteTagInput) options: DeleteTagInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Tag | null> {
    try {
      const deletedTag = await ctx.prisma.tag.delete({
        where: {
          id: options.id,
        },
      });
      return deletedTag;
    } catch (err) {
      throw new ApolloError(err);
    }
  }
}
