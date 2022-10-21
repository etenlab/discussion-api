import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, Length, MaxLength } from 'class-validator';

@InputType()
export class NewDiscussionInput {
  @Field(() => Int, { nullable: false })
  app: number;

  @Field(() => Int, { nullable: false })
  org: number;

  @Field({ nullable: false })
  tableName: string;

  @Field(() => Int, { nullable: false })
  row: number;
}
