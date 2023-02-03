import {
  NotFoundException,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { DiscussionsService } from '../discussions/discussions.service';
import { NewPostInput } from './new-post.input';

@Resolver(() => Post)
@Injectable()
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
    @Args('discussionId', { type: () => Int }) discussionId: number,
  ): Promise<Post[]> {
    const posts = await this.postsService.findPostsByDiscussionId(discussionId);
    if (!posts) {
      return [];
    }
    return posts;
  }

  @Mutation(() => Post)
  async createPost(
    @Args('newPostData') newPostData: NewPostInput,
    @Args('files', { type: () => [Int], nullable: 'items' }) files: number[],
  ): Promise<Post> {
    const { id } = await this.postsService.create(newPostData, files);
    const post = await this.postsService.findPostById(id);
    if (!post) {
      throw new NotFoundException(id);
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deleteAttachment(
    @Args('attachmentId', { type: () => Int }) attachmentId: number,
    @Args('post_id', { type: () => Int }) post_id: number,
  ) {
    return await this.postsService.deleteAttachmentById(attachmentId, post_id);
  }

  @Mutation(() => Post)
  async updatePost(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: NewPostInput,
  ): Promise<Post> {
    const success = await this.postsService.update(id, data);

    if (!success) {
      throw new ConflictException(id);
    }

    const post = await this.postsService.findPostById(id);

    if (!post) {
      throw new NotFoundException(id);
    }

    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Args('id', { type: () => Int }) id: number,
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const isDeleted = await this.postsService.delete(id, userId);
    return isDeleted;
  }

  @Mutation(() => Boolean)
  async deletePostsByDiscussionId(
    @Args('discussionId', { type: () => Int }) discussionId: number,
  ) {
    return this.postsService.deletePostsByDiscussionId(discussionId);
  }
}
