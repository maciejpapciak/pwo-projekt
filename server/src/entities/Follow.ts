import { Field, InputType, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class Follow {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  userId!: number;

  @Field(() => Int)
  courseId!: number;
}

@InputType()
export class CreateFollowInput {
  @Field(() => Int)
  userId!: number;

  @Field(() => Int)
  courseId!: number;
}

@InputType()
export class UpdateFollowInput {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  userId!: number;

  @Field(() => Int)
  courseId!: number;
}

@InputType()
export class DeleteFollowInput {
  @Field(() => Int)
  id!: number;
}
