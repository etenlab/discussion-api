import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, Int } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Discussion } from './discussion.model';
import { DiscussionsService } from './discussions.service';
import { NewDiscussionInput } from './new-discussion.input';

const pubSub = new PubSub();

@Resolver(of => Discussion)
export class DiscussionsResolver {
  constructor(private readonly discussionsService: DiscussionsService) {}

  @Query(returns => Discussion)
  async discussion(@Args('id') id: number): Promise<Discussion> {
    const discussion = await this.discussionsService.findOneById(id);
    if (!discussion) {
      throw new NotFoundException(id);
    }
    return discussion;
  }

  @Mutation(returns => Discussion)
  async addDiscussion(
    @Args('newDiscussionData') newDiscussionData: NewDiscussionInput,
  ): Promise<Discussion> {
    const discussion = await this.discussionsService.create(newDiscussionData);
    pubSub.publish('discussionAdded', { discussionAdded: discussion });
    return discussion;
  }

  @Mutation(returns => Boolean)
  async removeDiscussion(@Args('id') id: number) {
    return this.discussionsService.remove(id);
  }

  @Subscription(returns => Discussion)
  discussionAdded() {
    return pubSub.asyncIterator('discussionAdded');
  }
}
