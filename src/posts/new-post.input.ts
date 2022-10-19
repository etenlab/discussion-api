import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class NewPostInput {
  @Field(type => Int)
  discussion_id: number;

  @Field(type => String, { nullable: false })
  user_id: string;

  @Field(type => String)
  quill_text: string;

  @Field(type => String)
  plain_text: string;

  @Field(type => String, { nullable: false, defaultValue: 'simple' })
  postgres_language: string;
}
