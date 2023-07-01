import { Field, InputType, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class Tag {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  name: string;
}

@InputType()
export class CreateTagInput {
  @Field(() => String)
  name!: string;
}

@InputType()
export class UpdateTagInput {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  name!: string;
}

@InputType()
export class DeleteTagInput {
  @Field(() => Int)
  id!: number;
}
