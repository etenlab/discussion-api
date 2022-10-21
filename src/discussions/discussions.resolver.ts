import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Discussion } from './discussion.model';
import { DiscussionsService } from './discussions.service';
import { NewDiscussionInput } from './new-discussion.input';

@Resolver(of => Discussion)
export class DiscussionsResolver {
  constructor(
    private readonly discussionsService: DiscussionsService,
  ) {}

  @Query(returns => Discussion)
  async discussion(@Args('id') id: number): Promise<Discussion> {
    const discussion = await this.discussionsService.findOneById(id);
    if (!discussion) {
      throw new NotFoundException(id);
    }
    return discussion;
  }

  @Query(returns => [Discussion])
  async discussions(
    @Args('table_name') table_name: string,
    @Args('row') row: number
  ): Promise<Discussion[]> {
    const discussions = await this.discussionsService.findByTableRow(table_name, row);
    if (!discussions) {
      return [];
    }
    return discussions;
  }

  @Mutation(returns => Discussion)
  async addDiscussion(
    @Args('newDiscussionData') newDiscussionData: NewDiscussionInput,
  ): Promise<Discussion> {
    const discussion = await this.discussionsService.create(newDiscussionData);
    return discussion;
  }

  @Mutation(returns => Boolean)
  async removeDiscussion(@Args('id') id: number) {
    return this.discussionsService.remove(id);
  }
}