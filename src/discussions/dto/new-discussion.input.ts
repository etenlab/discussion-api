import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, Length, MaxLength } from 'class-validator';

@InputType()
export class NewDiscussionInput {
  @Field({ nullable: false })
  tableName: string;

  @Field(() => Int, { nullable: false })
  row: number;
}
