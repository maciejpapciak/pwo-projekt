import { Field, InputType, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class CourseTag {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  courseId!: number;

  @Field(() => Int)
  tagId!: number;
}

@InputType()
export class CreateCourseTagInput {
  @Field(() => Int)
  courseId!: number;

  @Field(() => Int)
  tagId!: number;
}

@InputType()
export class UpdateCourseTagInput {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  courseId!: number;

  @Field(() => Int)
  tagId!: number;
}

@InputType()
export class DeleteCourseTagInput {
  @Field(() => Int)
  id!: number;
}
