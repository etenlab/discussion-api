import { NotFoundException } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  Resolver,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { Discussion } from 'src/discussions/discussion.model';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { DiscussionsService } from 'src/discussions/discussions.service';
import { NewPostInput } from './new-post.input';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly discussionsService: DiscussionsService,
  ) {}

  @Query(() => Post)
  async post(@Args('id') id: number): Promise<Post> {
    const post = await this.postsService.findPostById(id);
    if (!post) {
      throw new NotFoundException(id);
    }
    return post;
  }

  @Query(() => [Post])
  async postsByDiscussionId(
    @Args('discussionId') discussionId: number,
  ): Promise<Post[]> {
    const posts = await this.postsService.findPostsByDiscussionId(discussionId);
    if (!posts) {
      throw new NotFoundException(discussionId);
    }
    return posts;
  }

  @Mutation(() => Post)
  async createPost(@Args('data') data: NewPostInput): Promise<Post> {
    const post = await this.postsService.create(data);
    return post;
  }

  @Mutation(() => Post)
  async updatePost(
    @Args('id') id: number,
    @Args('data') data: NewPostInput,
    @Args('userId') userId: string,
  ): Promise<Post> {
    const post = await this.postsService.update(id, data, userId);
    return post;
  }

  @Mutation(() => Boolean)
  async removePost(@Args('id') id: number) {
    return this.postsService.removePostById(id);
  }

  @Mutation(() => Boolean)
  async removePostsByDiscussionId(@Args('discussionId') discussionId: number) {
    return this.postsService.removePostsByDiscussionId(discussionId);
  }

  @ResolveField('discussion', () => Discussion)
  async getDiscussion(@Parent() post: Post) {
    const discussion = await this.discussionsService.findOneById(
      post.discussion_id,
    );
    return discussion;
  }
}
