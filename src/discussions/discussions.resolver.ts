import { NotFoundException, Injectable } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { Discussion } from './discussion.model';
import { DiscussionsService } from './discussions.service';
import { NewDiscussionInput } from './new-discussion.input';

@Resolver(() => Discussion)
@Injectable()
export class DiscussionsResolver {
  static discussion: any;
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
  ): Promise<Discussion[]> {
    const discussions = await this.discussionsService.findByTableNameAndRow(
      table_name,
      row,
    );
    if (!discussions) {
      return [];
    }
    return discussions;
  }

  @Mutation(() => Discussion)
  async createDiscussion(
    @Args('newDiscussionData') newDiscussionData: NewDiscussionInput,
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
