import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription, Int } from '@nestjs/graphql';
import { Discussion } from 'src/discussions/discussion.model';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { NewPostInput } from './new-post.input';

@Resolver(of => Post)
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
  ) {}

  @Query(returns => Post)
  async post(@Args('id') id: number): Promise<Post> {
    const post = await this.postsService.findPostById(id);
    if (!post) {
      throw new NotFoundException(id);
    }
    return post;
  }

  @Query(returns => [Post])
  async postsByDiscussionId(@Args('discussionId') discussionId: number): Promise<Post[]> {
    const posts = await this.postsService.findPostsByDiscussionId(discussionId);
    if (!posts) {
      throw new NotFoundException(discussionId);
    }
    return posts;
  }

  @Mutation(returns => Post)
  async createPost(
    @Args('data') data: NewPostInput,
  ): Promise<Post> {
    const post = await this.postsService.create(data);
    return post;
  }

  @Mutation(returns => Post)
  async updatePost(
    @Args('id') id: number,
    @Args('data') data: NewPostInput,
    @Args('userId') userId: string,
  ): Promise<Post> {
    const post = await this.postsService.update(id, data, userId);
    return post;
  }

  @Mutation(returns => Boolean)
  async removePost(@Args('id') id: number) {
    return this.postsService.removePostById(id);
  }

  @Mutation(returns => Boolean)
  async removePostsByDiscussionId(@Args('discussionId') discussionId: number) {
    return this.postsService.removePostsByDiscussionId(discussionId);
  }
}
