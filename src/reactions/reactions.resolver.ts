import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Int,
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Reaction } from './reaction.model';
import { ReactionsService } from './reactions.service';
import { NewReactionInput } from './new-reaction.input';
import { Post } from 'src/posts/post.model';
import { PostsService } from 'src/posts/posts.service';

@Resolver(() => Reaction)
@Injectable()
export class ReactionsResolver {
  constructor(
    private readonly reactionsService: ReactionsService,
    private readonly postsService: PostsService,
  ) {}

  @Query(() => Reaction)
  async reaction(@Args('id') id: number): Promise<Reaction> {
    console.log('test');
    const reaction = await this.reactionsService.findById(id);
    if (!reaction) {
      throw new NotFoundException(id);
    }
    return reaction;
  }

  @Query(() => [Reaction])
  async reactionsByPostId(
    @Args('postId', { type: () => Int }) postId: number,
  ): Promise<Reaction[]> {
    const reactions = await this.reactionsService.findReactionsByPostId(postId);
    if (!reactions) {
      return [];
    }
    return reactions;
  }

  @Mutation(() => Reaction)
  async createReaction(
    @Args('newReactionData') newReactionData: NewReactionInput,
  ): Promise<Reaction> {
    const { id } = await this.reactionsService.create(newReactionData);
    const reaction = await this.reactionsService.findById(id);
    if (!reaction) {
      throw new NotFoundException(id);
    }
    return reaction;
  }

  @Mutation(() => Reaction)
  async updateReaction(
    @Args('id') id: number,
    @Args('data') data: NewReactionInput,
    @Args('userId') userId: number,
  ): Promise<Reaction> {
    const reaction = await this.reactionsService.update(id, data, userId);
    return reaction;
  }

  @Mutation(() => Boolean)
  async deleteReaction(
    @Args('id', { type: () => Int }) id: number,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const isDeleted = await this.reactionsService.delete(id, userId);
    return isDeleted;
  }

  @ResolveField('post', () => Post)
  async getPost(@Parent() reaction: Reaction) {
    const post = await this.postsService.findPostById(reaction.post_id);
    return post;
  }
}
