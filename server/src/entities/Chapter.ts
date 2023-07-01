import { Field, InputType, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class Chapter {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  name!: string;

  @Field(() => Int)
  courseId!: number;

  @Field(() => Int)
  index: number | null;
}

@InputType()
export class CreateChapterInput {
  @Field(() => String)
  name!: string;

  @Field(() => Int)
  courseId!: number;

  @Field(() => Int)
  index: number | null;
}

@InputType()
export class UpdateChapterInput {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  name!: string;

  @Field(() => Int)
  courseId!: number;
}

@InputType()
export class DeleteChapterInput {
  @Field(() => Int)
  id!: number;
}
