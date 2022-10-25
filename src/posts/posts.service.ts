import { Injectable, NotFoundException } from '@nestjs/common';
import { NewPostInput } from './new-post.input';
import { Post } from './post.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>
  ) {}

  async create(data: NewPostInput): Promise<Post> {
    const post = this.postRepository.create(data);
    return await this.postRepository.save(post);
  }

  async update(
    id: number,
    data: any,
    user_id: string
  ): Promise<Post> {
    const post = await this.postRepository.findOneOrFail({ where: { id } });
    if (post && post.user_id === user_id) {
      await this.postRepository.update({ id }, data);
      return this.postRepository.findOneOrFail({ where: { id } });
    }
    throw new NotFoundException("You cannot update what you don't own...");
  }

  async findPostById(id: number): Promise<Post> {
    const post = await this.postRepository.findOneOrFail({ where: { id } });
    if (!post) {
      throw new NotFoundException("You cannot update what you don't own...");
    }
    return post;
  }

  async findPostsByDiscussionId(discussionId: number): Promise<Post[]> {
    const posts = await this.postRepository.find({ 
      where: { discussion_id: discussionId },
      order: { id: "ASC" },
    });
    if (!posts) {
      throw new NotFoundException(`Posts of discussion #${discussionId} not found`);
    }
    return posts;
  }

  async removePostsByDiscussionId(discussionId: number): Promise<boolean> {
    const posts = await this.postRepository.find({ 
      where: { discussion_id: discussionId },
      order: { id: "ASC" },
    });
    if (!posts) {
      throw new NotFoundException(`Posts of discussion #${discussionId} not found`);
    }
    await this.postRepository.remove(posts);
    return true;
  }

  async removePostById(id: number): Promise<boolean> {
    const post = await this.postRepository.findOneOrFail({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    await this.postRepository.remove(post);
    return true;
  }
}
