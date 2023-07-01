import { Field, InputType, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class Category {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  name!: string;

  @Field(() => Int, { nullable: true })
  parentCategoryId?: number | null;
}

@InputType()
export class CreateCategoryInput {
  @Field(() => String)
  name!: string;

  @Field(() => Int, { nullable: true })
  parentCategoryId?: number;
}

@InputType()
export class UpdateCategoryInput {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  name!: string;

  @Field(() => Int)
  parentCategoryId?: number;
}

@InputType()
export class DeleteCategoryInput {
  @Field(() => Int)
  id!: number;
}

@InputType()
export class RetrieveSubCategoriesInput {
  @Field(() => Int)
  id!: number;
}
