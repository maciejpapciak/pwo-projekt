import { Field, ID, InputType, ObjectType } from 'type-graphql';
import {
  GraphQLBigInt,
  GraphQLDateTime,
  GraphQLEmailAddress,
  GraphQLNonNegativeInt,
  GraphQLUUID,
} from 'graphql-scalars';
import { IsBoolean, IsEmail, MaxLength } from 'class-validator';

@ObjectType()
export class User {
  @Field(() => ID)
  readonly id!: number;

  @Field(() => String, { nullable: true })
  @MaxLength(60)
  firstName: string | null;

  @Field(() => String, { nullable: true })
  @MaxLength(60)
  lastName: string | null;

  @Field(() => String)
  @MaxLength(60)
  username!: string;

  @Field(() => GraphQLEmailAddress)
  @IsEmail()
  email!: string;

  password!: string;

  @Field(() => Boolean)
  @IsBoolean()
  public isEmailConfirmed: boolean = false;

  @Field(() => GraphQLDateTime)
  dateCreated!: Date;

  @Field(() => GraphQLNonNegativeInt)
  public permissionLevel: number = 1;

  @Field(() => GraphQLBigInt, { nullable: true })
  githubId: bigint | null;

  @Field(() => String, { nullable: true })
  googleId: string | null;
}

@InputType()
export class UserRegisterInput {
  @Field(() => String)
  @MaxLength(60)
  firstName: string;

  @Field(() => String)
  @MaxLength(60)
  lastName: string;

  @Field(() => String)
  @MaxLength(60)
  username!: string;

  @Field(() => GraphQLEmailAddress)
  @IsEmail()
  email!: string;

  @Field(() => String)
  @MaxLength(100)
  password!: string;
}

@InputType()
export class UserLoginInput {
  @Field(() => GraphQLEmailAddress)
  @IsEmail()
  email!: string;

  @Field(() => String)
  @MaxLength(100)
  password!: string;
}

@InputType()
export class ChangePasswordInput {
  @Field(() => GraphQLUUID)
  uuidv4Token!: string;

  @Field(() => String)
  @MaxLength(60)
  password!: string;
}

@InputType()
export class UpdateUserMetaInfoInput {
  @Field(() => String)
  @MaxLength(60)
  firstName!: string;

  @Field(() => String)
  @MaxLength(60)
  lastName!: string;

  @Field(() => String)
  @MaxLength(60)
  username!: string;

  @Field(() => GraphQLNonNegativeInt)
  public permissionLevel: number = 1;
}

@InputType()
export class UpdateEmailInput {
  @Field(() => GraphQLEmailAddress)
  @IsEmail()
  email!: string;

  @Field(() => String)
  password!: string;
}

@InputType()
export class ChangeEmailInput {
  @Field(() => GraphQLUUID)
  uuidv4Token!: string;

  @Field(() => GraphQLEmailAddress)
  @IsEmail()
  email!: string;
}
