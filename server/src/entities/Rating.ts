import { GraphQLDate } from 'graphql-scalars';
import { Field, InputType, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class Rating {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  amount!: number;

  @Field(() => String)
  content!: string;

  @Field(() => GraphQLDate)
  dateCreated!: Date;

  @Field(() => Int)
  senderId!: number;
}

@InputType()
export class CreateRatingInput {
  @Field(() => Int)
  amount!: number;

  @Field(() => String)
  content!: string;

  @Field(() => Int)
  senderId!: number;

  @Field(() => Int)
  courseId!: number;
}

@InputType()
export class UpdateRatingInput {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  amount!: number;

  @Field(() => String)
  content!: string;

  @Field(() => Int)
  senderId!: number;
}

@InputType()
export class DeleteRatingInput {
  @Field(() => Int)
  id!: number;
}
