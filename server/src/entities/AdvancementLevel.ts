import { Field, ObjectType, Int, InputType } from 'type-graphql';

@ObjectType()
export class AdvancementLevel {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  name!: string;
}

@InputType()
export class CreateAdvancementLevelInput {
  @Field(() => String)
  name!: string;
}

@InputType()
export class UpdateAdvancementLevelInput {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  name!: string;
}

@InputType()
export class DeleteAdvancementLevelInput {
  @Field(() => Int)
  id!: number;
}
