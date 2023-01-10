import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DiscussionSummary {
  @Field(() => Int)
  readonly id: number;

  @Field(() => String)
  readonly table_name: string;

  @Field(() => Int)
  readonly row: number;

  @Field(() => Int)
  readonly total_posts: number;
}
