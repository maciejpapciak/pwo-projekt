import { ApolloError } from 'apollo-server-express';
import { Arg, Ctx, Mutation, Query, Resolver, Int } from 'type-graphql';
import { GraphQLJSON } from 'graphql-scalars';
import logger from '../utils/logger';
import {
  UpdateCourseInput,
  DeleteCourseInput,
  CreateCourseInput,
  Course,
  PaginatedCourses,
  FilterCoursesInput,
  PaginatedCoursesInput,
} from '../entities/Course';
import { ServerContext } from '../types/customTypes';
import { stripeClient } from '../utils/stripeClient';
// import { fulfillOrder } from '../stripe/stripeEventHandler';

@Resolver(Course)
export class CourseResolver {
  @Query(() => [Course])
  async retrieveCourses(
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Course[] | null> {
    try {
      const courseCollection = await ctx.prisma.course.findMany();
      return courseCollection;
    } catch (err) {
      logger.error('error in retrieveCourses()');
      throw new ApolloError(err);
    }
  }

  @Query(() => GraphQLJSON)
  async retrieveBoughtCourses(
    @Arg('id', () => Int)
    id: number,
    @Ctx() { context: ctx }: ServerContext,
  ) {
    try {
      const extendecCoursesById = await ctx.prisma.$queryRaw(
        `SELECT "course".id,
        "course".title,
        description,
        price,
        thumbnail,
        STRING_AGG(distinct "tag".name,',') as tags,
         (
          SELECT "user".username
          FROM "user"
          WHERE "user".id = "course".author_id
       ) as author_name,
        "advancementLevel".name as advancement_level,
        "category".name as category_name,
        SUM(distinct "library".duration) as duration,
        ROUND(COALESCE(AVG("rating".amount),0),2) as average_rating

        FROM "course"
          JOIN "category" ON "course".category_id = "category".id
          JOIN "advancementLevel" ON "advancementLevel".id = "course"."advancementLevel_id"
          JOIN "order" ON "order".course_id = "course".id
          JOIN "user" ON "order".user_id = "user".id
          JOIN "courseTag" ON "course".id = "courseTag".course_id
          JOIN "tag" ON "courseTag".tag_id = "tag".id
          JOIN "chapter" ON "course".ID = "chapter".course_id
          JOIN "library" ON "chapter".ID = "library".chapter_id
          LEFT JOIN "rating" ON "rating".course_id = "course".id
          WHERE "user".ID = ${id}
        GROUP BY "course".id, "course".title, description, price,
        thumbnail, author_id, "advancementLevel".name,"user".username,"category".name`,
      );
      for (let i = 0; i < extendecCoursesById.length; i += 1) {
        const splittedTags = extendecCoursesById[i].tags.split(',');
        extendecCoursesById[i].tags = splittedTags;
      }

      return extendecCoursesById;
    } catch (err) {
      logger.error('error in retrieveExtendedCourseByUserId');
      throw new ApolloError(err);
    }
  }

  @Query(() => GraphQLJSON)
  async retrieveCourseById(
    @Arg('id', () => Int)
    id: number,
    @Ctx() { context: ctx }: ServerContext,
  ) {
    try {
      const extendedCourse = await ctx.prisma.$queryRaw(
        `SELECT "course".id,
        "course".title,
        description,
        price,
        thumbnail,
        STRING_AGG(distinct "tag".name,',') as tags,
        author_id,
        "user".username,
        "course"."stripe_id",
        "course"."advancementLevel_id",
        SUM(distinct "library".duration) as duration,
        ROUND(AVG("rating".amount),2) as avarage_rating
        FROM "course"
          JOIN "user" ON "course".author_id = "user".id
          JOIN "courseTag" ON "course".id = "courseTag".course_id
          JOIN "tag" ON "courseTag".tag_id = "tag".id
          JOIN "chapter" ON "course".ID = "chapter".course_id
          JOIN "library" ON "chapter".ID = "library".chapter_id
          LEFT JOIN "rating" ON "rating".course_id = "course".id
          WHERE "course".ID = ${id}
        GROUP BY "course".id, "course".title, description, price, thumbnail, author_id, "course"."advancementLevel_id", "user".username, "course".stripe_id`,
      );
      const splittedTags = extendedCourse[0].tags.split(',');
      extendedCourse[0].tags = splittedTags;
      return extendedCourse;
    } catch (err) {
      logger.error('error in retrieveCourseByCourseId()');
      throw new ApolloError(err);
    }
  }

  @Query(() => PaginatedCourses)
  async retrievePaginatedCourses(
    @Arg('options', () => PaginatedCoursesInput) options: PaginatedCoursesInput,
    @Ctx() { context: ctx }: ServerContext,
  ) {
    try {
      const count = await ctx.prisma.course.count();
      return {
        nodes: await ctx.prisma.course.findMany({
          take: options.pageSize,
          skip: options.page * options.pageSize,
        }),
        meta: {
          nodeCount: count,
          pageCount: Math.ceil(count / options.pageSize),
          pageCurrent: (options.page * options.pageSize) / options.pageSize,
          nodesPerPage: options.pageSize,
        },
      };
    } catch (err) {
      logger.error('error in retrievePaginatedCourses()');
      throw new ApolloError(err);
    }
  }

  @Query(() => GraphQLJSON)
  async mostPopularCourses(@Ctx() { context: ctx }: ServerContext) {
    try {
      const mostPopularCourses = await ctx.prisma.$queryRaw(`
        SELECT DISTINCT "course".id,"course".title, ROUND(COALESCE(AVG("rating".amount),0),2) as average_rating, "course".author_id,
        description,
        price,
        thumbnail,
        STRING_AGG(distinct "tag".name,',') as tags,
        (
        SELECT "user".username
        FROM "user"
        WHERE "user".id = "course".author_id
      ) as author_name,
      "advancementLevel".name as advancement_level,
      "category".name as category_name,
      SUM(distinct "library".duration) as duration


      FROM "course"
      JOIN "category" ON "course".category_id = "category".id
      JOIN "advancementLevel" ON "advancementLevel".id = "course"."advancementLevel_id"
      LEFT JOIN "order" ON "order".course_id = "course".id
      LEFT JOIN "user" ON "order".user_id = "user".id
      LEFT JOIN "courseTag" ON "course".id = "courseTag".course_id
      LEFT JOIN "tag" ON "courseTag".tag_id = "tag".id
      LEFT JOIN "chapter" ON "course".ID = "chapter".course_id
      LEFT JOIN "library" ON "chapter".ID = "library".chapter_id
      LEFT JOIN "rating" ON "rating".course_id = "course".id
        GROUP BY "course".id, "course".title, description, price,
          thumbnail, author_id, "advancementLevel".name,"user".username,"category".name, "course".author_id
      ORDER BY average_rating DESC
      LIMIT 5
    `);

      const result = mostPopularCourses.map((course) => {
        if (course.tags === null) course.tags = [];
        else {
          course.tags = course.tags.split(',');
        }
        return course;
      });

      return result;
    } catch (err) {
      logger.error('error in mostPopularCourses()');
      throw new ApolloError(err);
    }
  }

  @Query(() => GraphQLJSON)
  async filteredCourses(
    @Arg('options', () => FilterCoursesInput) options: FilterCoursesInput,
    @Ctx() { context: ctx }: ServerContext,
  ) {
    try {
      const FilteredCourses = await ctx.prisma.$queryRaw(`
    SELECT DISTINCT "course".id,"course".title, ROUND(COALESCE(AVG("rating".amount),0),2) as average_rating,
    description,
    price,
    thumbnail,
    STRING_AGG(distinct "tag".name,',') as tags,
    (
     SELECT "user".username
     FROM "user"
     WHERE "user".id = "course".author_id
  ) as author_name,
  "advancementLevel".name as advancement_level,
  "category".name as category_name,
  SUM(distinct "library".duration) as duration
	FROM "course"
  JOIN "category" ON "course".category_id = "category".id
  JOIN "advancementLevel" ON "advancementLevel".id = "course"."advancementLevel_id"
  LEFT JOIN "order" ON "order".course_id = "course".id
  LEFT JOIN "user" ON "order".user_id = "user".id
  LEFT JOIN "courseTag" ON "course".id = "courseTag".course_id
  LEFT JOIN "tag" ON "courseTag".tag_id = "tag".id
  LEFT JOIN "chapter" ON "course".ID = "chapter".course_id
  LEFT JOIN "library" ON "chapter".ID = "library".chapter_id
  LEFT JOIN "rating" ON "rating".course_id = "course".id
  WHERE "advancementLevel".id = ANY(
	CASE
  		WHEN ${options.advancementLevel} = 0 THEN '{1,2,3}'::int[]
		WHEN ${options.advancementLevel} = 1 THEN '{1}'::int[]
		WHEN ${options.advancementLevel} = 2 THEN '{2}'::int[]
		WHEN ${options.advancementLevel} = 3 THEN '{3}'::int[]
  END
  )
   AND "category".id = ${options.categoryId}
  GROUP BY "course".id, "course".title, description, price,
   thumbnail, author_id, "advancementLevel".name,"user".username,"category".name
  HAVING SUM(distinct "library".duration) <=
  	CASE
	  WHEN ${options.duration} = 0 THEN 99999
	  WHEN ${options.duration} = 1 THEN (1*60)
	  WHEN ${options.duration} = 3 THEN (3*60)
	  WHEN ${options.duration} = 6 THEN (6*60)
  END

  AND ROUND(COALESCE(AVG("rating".amount),0),2) >=
  CASE
  	WHEN ${options.rating} = 0.00 THEN 0.00
	WHEN ${options.rating} = 3.00 THEN 3.00
	WHEN ${options.rating} = 3.50 THEN 3.50
	WHEN ${options.rating} = 4.00 THEN 4.00
	WHEN ${options.rating} = 4.50 THEN 4.50
  END;
    `);
      for (let i = 0; i < FilteredCourses.length; i += 1) {
        const splittedTags = FilteredCourses[i].tags.split(',');
        FilteredCourses[i].tags = splittedTags;
      }

      return FilteredCourses;
    } catch (err) {
      logger.error('error in retrieveExtendedCourseByUserId');
      throw new ApolloError(err);
    }
  }

  @Query(() => GraphQLJSON)
  async retrieveCreatedCourses(
    @Arg('id', () => Int) id: number,
    @Ctx() { context: ctx }: ServerContext,
  ) {
    const createdCourses = await ctx.prisma.$queryRaw(`
    SELECT "course".id,
    "course".title,
    description,
    price,
    thumbnail,
    STRING_AGG(distinct "tag".name,',') as tags,
     (
      SELECT "user".username
      FROM "user"
      WHERE "user".id = "course".author_id
   ) as author_name,
    "advancementLevel".name as advancement_level,
    "category".name as category_name,
    SUM(distinct "library".duration) as duration,
    ROUND(COALESCE(AVG("rating".amount),0),2) as average_rating

    FROM "course"
      JOIN "category" ON "course".category_id = "category".id
      JOIN "advancementLevel" ON "advancementLevel".id = "course"."advancementLevel_id"
      JOIN "courseTag" ON "course".id = "courseTag".course_id
      JOIN "tag" ON "courseTag".tag_id = "tag".id
      LEFT JOIN "chapter" ON "course".ID = "chapter".course_id
      LEFT JOIN "library" ON "chapter".ID = "library".chapter_id
      LEFT JOIN "rating" ON "rating".course_id = "course".id
      WHERE "course".author_id = ${id}
    GROUP BY "course".id, "course".title, description, price,
    thumbnail, author_id, "advancementLevel".name,"category".name

    `);
    return createdCourses;
  }

  @Query(() => GraphQLJSON)
  async retrieveCourseContent(
    @Arg('id', () => Int) id: number,
    @Ctx() { context: ctx, req }: ServerContext,
  ) {
    const siema = await ctx.prisma.$queryRaw(`
    SELECT "chapter".id as chapterid, "chapter".name as chaptername,
    STRING_AGG("library".id || ',' || "library".title ||',' || CASE
    (SELECT COUNT(1)
     FROM "order"
     WHERE "order".course_id = ${id}
     AND "order".user_id = ${req.session.userId}
      )
      WHEN 1 THEN "library".path
      ELSE '' END
    , 'papryk') as library
    FROM "chapter"
    JOIN "course" ON "course".id = "chapter".course_id
    JOIN "library" ON "library".chapter_id = "chapter".id
    WHERE "course".id = ${id}
    GROUP BY "chapter".id , "chapter".name 
    ORDER BY "chapter".index ASC
    `);
    for (let j = 0; j < siema.length; j += 1) {
      siema[j].library = siema[j].library.split('papryk');
      for (let i = 0; i < siema[j].library.length; i += 1) {
        siema[j].library[i] = { ...siema[j].library[i].split(',') };
      }
    }
    return siema;
  }

  @Mutation(() => Course)
  async createCourse(
    @Arg('options', () => CreateCourseInput) options: CreateCourseInput,
    @Ctx() { req, context: ctx }: ServerContext,
  ): Promise<Course> {
    try {
      const course = await stripeClient.products.create({
        name: options.title,
        description: options.description,
        metadata: {
          authorId: req.session.userId as number,
          categoryId: options.categoryId,
          advancementLevel: options.advancementLevelId,
          thumbnail: options.thumbnail,
        },
      });

      const coursePrice = await stripeClient.prices.create({
        product: course.id,
        unit_amount_decimal: (
          (options.price as unknown as number) * 100
        ).toString(),
        currency: 'pln',
        metadata: {
          productId: course.id,
        },
      });

      const createdCourse = await ctx.prisma.course.create({
        data: {
          title: options.title,
          description: options.description,
          price: options.price,
          authorId: req.session.userId as number,
          categoryId: options.categoryId,
          advancementLevelId: options.advancementLevelId,
          thumbnail: options.thumbnail,
          stripeId: coursePrice.id,
        },
      });
      return createdCourse;
    } catch (err) {
      logger.error('error in createCourse()');
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Course)
  async updateCourse(
    @Arg('options', () => UpdateCourseInput) options: UpdateCourseInput,
    @Ctx() { context: ctx, req }: ServerContext,
  ): Promise<Course | null> {
    try {
      const updatedCourse = await ctx.prisma.course.update({
        where: { id: options.id || undefined },
        data: {
          title: options.title,
          description: options.description,
          price: options.price,
          authorId: req.session.userId,
          categoryId: options.categoryId,
          advancementLevelId: options.advancementLevelId,
        },
      });
      return updatedCourse;
    } catch (err) {
      logger.error('error in updateCourse()');
      throw new ApolloError(err);
    }
  }

  @Mutation(() => Course)
  async deleteCourse(
    @Arg('options', () => DeleteCourseInput) options: DeleteCourseInput,
    @Ctx() { context: ctx }: ServerContext,
  ): Promise<Course | null> {
    try {
      const deletedCourse = await ctx.prisma.course.delete({
        where: {
          id: options.id,
        },
      });
      return deletedCourse;
    } catch (err) {
      logger.error('error in deleteCourse()');
      throw new ApolloError(err);
    }
  }
}
