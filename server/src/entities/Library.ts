import { GraphQLNonNegativeFloat } from 'graphql-scalars';
import { Field, InputType, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class Library {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  title!: string;

  @Field(() => Int)
  chapterId!: number;

  @Field(() => GraphQLNonNegativeFloat)
  duration!: number;

  @Field(() => String)
  path!: string;
}

@InputType()
export class CreateLibraryInput {
  @Field(() => String)
  title!: string;

  @Field(() => Int)
  chapterId!: number;

  @Field(() => GraphQLNonNegativeFloat)
  duration!: number;

  @Field(() => String)
  path!: string;
}

@InputType()
export class UpdateLibraryInput {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  title!: string;

  @Field(() => Int)
  chapterId!: number;

  @Field(() => GraphQLNonNegativeFloat)
  duration!: number;

  @Field(() => String)
  path!: string;
}

@InputType()
export class DeleteLibraryInput {
  @Field(() => Int)
  id!: number;
}
