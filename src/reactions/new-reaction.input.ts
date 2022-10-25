import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class NewReactionInput {
  @Field(type => Int, { nullable: false })
  post_id: number;

  @Field(type => String, { nullable: false })
  user_id: string;

  @Field(type => String, { nullable: false })
  content: string;
}
