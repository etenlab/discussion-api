import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class NewReactionInput {
  @Field(type => String, { nullable: false })
  user_id: string;

  @Field(type => Int, { nullable: false })
  content: number;
}
