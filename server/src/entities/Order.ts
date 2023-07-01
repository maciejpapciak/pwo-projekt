import { Field, InputType, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class Order {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  courseId!: number;

  @Field(() => Int)
  userId!: number;
}

@InputType()
export class CreateOrderInput {
  @Field(() => Int)
  courseId!: number;

  @Field(() => Int)
  userId!: number;
}

@InputType()
export class UdpdateOrderInput {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  courseId!: number;

  @Field(() => Int)
  userId!: number;
}

@InputType()
export class DeleteOrderInput {
  @Field(() => Int)
  id!: number;
}
