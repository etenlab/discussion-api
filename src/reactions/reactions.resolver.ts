import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, Int } from '@nestjs/graphql';
import { Discussion } from 'src/discussions/discussion.model';
import { Reaction } from './reaction.model';
import { ReactionsService } from './reactions.service';
import { NewReactionInput } from './new-reaction.input';

@Resolver(of => Reaction)
export class ReactionsResolver {
  constructor(
    private readonly reactionsService: ReactionsService,
  ) {}

  @Query(returns => Reaction)
  async reaction(@Args('id') id: number): Promise<Reaction> {
    const reaction = await this.reactionsService.findById(id);
    if (!reaction) {
      throw new NotFoundException(id);
    }
    return reaction;
  }

  @Query(returns => [Reaction])
  async reactions(@Args('post') postId: number): Promise<Reaction[]> {
    const reactions = await this.reactionsService.findByPost(postId);
    if (!reactions) {
      return [];
    }
    return reactions;
  }

  @Mutation(returns => Reaction)
  async createReaction(
    @Args('data') data: NewReactionInput,
  ): Promise<Reaction> {
    const reaction = await this.reactionsService.create(data);
    return reaction;
  }

  @Mutation(returns => Reaction)
  async updateReaction(
    @Args('id') id: number,
    @Args('data') data: NewReactionInput,
    @Args('userId') userId: string,
  ): Promise<Reaction> {
    const reaction = await this.reactionsService.update(id, data, userId);
    return reaction;
  }

  @Mutation(returns => Boolean)
  async removeReaction(@Args('id') id: number) {
    return this.reactionsService.remove(id);
  }
}
