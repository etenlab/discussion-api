import { NotFoundException } from '@nestjs/common';
import {
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
export class ReactionsResolver {
  constructor(
    private readonly reactionsService: ReactionsService,
    private readonly postsService: PostsService,
  ) {}

  @Query(() => Reaction)
  async reaction(@Args('id') id: number): Promise<Reaction> {
    const reaction = await this.reactionsService.findById(id);
    if (!reaction) {
      throw new NotFoundException(id);
    }
    return reaction;
  }

  @Query(() => [Reaction])
  async reactions(@Args('post') postId: number): Promise<Reaction[]> {
    const reactions = await this.reactionsService.findByPost(postId);
    if (!reactions) {
      return [];
    }
    return reactions;
  }

  @Mutation(() => Reaction)
  async createReaction(
    @Args('data') data: NewReactionInput,
  ): Promise<Reaction> {
    const reaction = await this.reactionsService.create(data);
    return reaction;
  }

  @Mutation(() => Reaction)
  async updateReaction(
    @Args('id') id: number,
    @Args('data') data: NewReactionInput,
    @Args('userId') userId: string,
  ): Promise<Reaction> {
    const reaction = await this.reactionsService.update(id, data, userId);
    return reaction;
  }

  @Mutation(() => Boolean)
  async removeReaction(@Args('id') id: number) {
    return this.reactionsService.remove(id);
  }

  @ResolveField('post', () => Post)
  async getPost(@Parent() reaction: Reaction) {
    const post = await this.postsService.findPostById(reaction.post_id);
    return post;
  }
}
