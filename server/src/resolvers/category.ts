import { ApolloError } from 'apollo-server-express';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import {
  RetrieveSubCategoriesInput,
  CreateCategoryInput,
  DeleteCategoryInput,
  UpdateCategoryInput,
  Category,
} from '../entities/Category';
import { ServerContext } from '../types/customTypes';
import logger from '../utils/logger';

@Resolver(() => Category)
export class CategoryResolver {
  @Query(() => [Category])
  async retrieveCategories(
    /*
    Functions that retrieves all categories
    */
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Category[] | null> {
    try {
      const categoryCollection = await ctx.prisma.category.findMany({
        include: {
          category: true,
        },
        where: { parentCategoryId: { equals: null } },
      });
      return categoryCollection;
    } catch (err) {
      throw new ApolloError(err);
    }
  }

  @Query(() => [Category])
  async retrieveSubcategories(
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Category[]> {
    try {
      const allSubcategories = await ctx.prisma.category.findMany({
        where: {
          parentCategoryId: { not: null },
        },
      });
      return allSubcategories;
    } catch (err) {
      logger.error(err);
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Category, { nullable: true })
  async createCategory(
    @Arg('options', () => CreateCategoryInput, { nullable: true })
    options: CreateCategoryInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Category | null> {
    try {
      const newCategory = await ctx.prisma.category.create({
        data: {
          name: options.name,
          parentCategoryId: options.parentCategoryId,
        },
      });
      return newCategory;
    } catch (err) {
      throw new ApolloError(err);
    }
  }

  @Query(() => [Category])
  async retrieveSubCategories(
    @Arg('options', () => RetrieveSubCategoriesInput)
    options: RetrieveSubCategoriesInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Category[] | null> {
    try {
      const subCategoryCollection = await ctx.prisma.category.findMany({
        where: {
          parentCategoryId: options.id,
        },
      });
      return subCategoryCollection;
    } catch (err) {
      logger.error(err);
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Category)
  async updateCategory(
    @Arg('options', () => UpdateCategoryInput) options: UpdateCategoryInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Category | null> {
    try {
      const updatedCategory = await ctx.prisma.category.update({
        where: { id: options.id || undefined },
        data: {
          name: options.name,
          parentCategoryId: options.parentCategoryId,
        },
      });
      return updatedCategory;
    } catch (err) {
      logger.error(err);
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Category)
  async deleteCategory(
    @Arg('options', () => DeleteCategoryInput) options: DeleteCategoryInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Category | null> {
    try {
      const deletedCategory = await ctx.prisma.category.delete({
        where: {
          id: options.id,
        },
      });
      return deletedCategory;
    } catch (err) {
      logger.error(err);
      throw new ApolloError(err);
    }
  }
}
