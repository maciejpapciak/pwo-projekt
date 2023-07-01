import { Field, InputType, Int, ObjectType } from 'type-graphql';
import { Prisma } from '@prisma/client';
import { GraphQLDecimal } from 'prisma-graphql-type-decimal';

@ObjectType()
export class Course {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  title!: string;

  @Field(() => String)
  description!: string;

  @Field(() => GraphQLDecimal)
  price!: Prisma.Decimal;

  @Field(() => Int)
  authorId!: number;

  @Field(() => Int)
  categoryId!: number;

  @Field(() => Int)
  advancementLevelId!: number;

  @Field(() => String)
  thumbnail: string | null;

  @Field(() => String)
  stripeId!: string | null;
}

@InputType()
export class CreateCourseInput {
  @Field(() => String)
  title!: string;

  @Field(() => String)
  description!: string;

  @Field(() => GraphQLDecimal)
  price!: Prisma.Decimal;

  @Field(() => Int)
  categoryId!: number;

  @Field(() => Int)
  advancementLevelId!: number;

  @Field(() => String)
  thumbnail: string | null;
}

@InputType()
export class UpdateCourseInput {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  title!: string;

  @Field(() => String)
  description!: string;

  @Field(() => GraphQLDecimal)
  price!: Prisma.Decimal;

  @Field(() => Int)
  categoryId!: number;

  @Field(() => Int)
  advancementLevelId!: number;

  @Field(() => String)
  thumbnail: string | null;
}

@InputType()
export class DeleteCourseInput {
  @Field(() => Int)
  id!: number;
}

@InputType()
export class ExtendedCourseByIdInput {
  @Field(() => Int)
  id!: number;
}

@ObjectType()
export class PaginatedCoursesMeta {
  @Field(() => Int)
  nodeCount!: number;

  @Field(() => Int)
  pageCount!: number;

  @Field(() => Int)
  pageCurrent!: number;

  @Field(() => Int)
  nodesPerPage!: number;
}

@ObjectType()
export class PaginatedCourses {
  @Field(() => [Course])
  nodes!: Course[];

  @Field(() => PaginatedCoursesMeta)
  meta!: PaginatedCoursesMeta;
}

@InputType()
export class FilterCoursesInput {
  @Field(() => Int)
  categoryId!: number;

  @Field({ defaultValue: 0 })
  duration!: number;

  @Field({ defaultValue: 0 })
  rating!: number;

  @Field({ defaultValue: 0 })
  advancementLevel!: number;
}

@InputType()
export class PaginatedCoursesInput {
  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  pageSize!: number;
}
