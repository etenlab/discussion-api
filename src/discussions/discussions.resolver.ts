import { NotFoundException, Injectable } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { Discussion } from './discussion.model';
import { DiscussionsService } from './discussions.service';
import { DiscussionInput } from './discussion.input';
import { DiscussionSummary } from './dto/DiscussionSummary';

@Resolver(() => Discussion)
@Injectable()
export class DiscussionsResolver {
  constructor(private readonly discussionsService: DiscussionsService) {}

  @Query(() => Discussion)
  async discussion(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Discussion> {
    const discussion = await this.discussionsService.findOneById(id);
    if (!discussion) {
      throw new NotFoundException(id);
    }
    return discussion;
  }

  @Query(() => [Discussion])
  async discussions(
    @Args('table_name') table_name: string,
    @Args('row', { type: () => Int }) row: number,
    @Args('app_id', { type: () => Int }) app_id: number,
    @Args('org_id', { type: () => Int }) org_id: number,
  ): Promise<Discussion[]> {
    const discussions = await this.discussionsService.findWithParams({
      table_name,
      row,
      app_id,
      org_id,
    });
    if (!discussions) {
      return [];
    }
    return discussions;
  }

  @Query(() => [DiscussionSummary])
  async getDiscussionsSummaryByUserId(
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<DiscussionSummary[]> {
    const discussions =
      await this.discussionsService.getDiscussionsSummaryByUserId(userId);
    if (!discussions) {
      return [];
    }
    return discussions;
  }

  @Mutation(() => Discussion)
  async createDiscussion(
    @Args('newDiscussionData') newDiscussionData: DiscussionInput,
  ): Promise<Discussion> {
    const { id } = await this.discussionsService.create(newDiscussionData);
    const discussion = await this.discussionsService.findOneById(id);
    if (!discussion) {
      throw new NotFoundException(id);
    }
    return discussion;
  }

  @Mutation(() => Boolean)
  async deleteDiscussion(@Args('id', { type: () => Int }) id: number) {
    return this.discussionsService.delete(id);
  }
}
