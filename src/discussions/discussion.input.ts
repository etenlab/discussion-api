import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class DiscussionInput {
  @Field(() => Int, { nullable: false })
  app_id: number;

  @Field(() => Int, { nullable: false })
  org_id: number;

  @Field({ nullable: false })
  table_name: string;

  @Field(() => Int, { nullable: false })
  row: number;
}
