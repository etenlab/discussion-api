import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { NewPostInput } from './new-post.input';
import { Post } from './post.model';
import { RelationshipPostFile } from './relationship-post-file.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(RelationshipPostFile)
    private relationshipPostFileRepository: Repository<RelationshipPostFile>,
  ) {}

  async create(data: NewPostInput, files: number[]): Promise<Post> {
    const post = this.postRepository.create(data);
    const savedPost = await this.postRepository.save(post);
    console.log(savedPost);
    if (!savedPost) {
      throw new NotFoundException(savedPost.id);
    }
    await this.relationshipPostFileRepository.insert(
      files.map((file_id) => ({
        file_id,
        post_id: savedPost.id,
      })),
    );
    return savedPost;
  }

  async update(id: number, data: NewPostInput): Promise<boolean> {
    const post = await this.postRepository.findOneOrFail({ where: { id } });
    if (!post) {
      throw new NotFoundException(id);
    }
    if (post.user_id === data.user_id) {
      throw new UnauthorizedException(data.user_id);
    }
    await this.postRepository.update({ id }, data);
    return true;
  }

  async findPostById(id: number): Promise<Post> {
    const post = await this.postRepository.findOneOrFail({
      relations: ['reactions', 'reactions.user', 'user', 'files', 'files.file'],
      where: { id },
    });
    if (!post) {
      throw new NotFoundException(`Cannot find post id="${id}"`);
    }
    return post;
  }

  async findPostsByDiscussionId(discussionId: number): Promise<Post[]> {
    const posts = await this.postRepository.find({
      relations: ['reactions', 'reactions.user', 'user', 'files', 'files.file'],
      where: { discussion_id: discussionId },
      order: { created_at: 'ASC' },
    });
    if (!posts) {
      throw new NotFoundException(
        `Posts of discussion #${discussionId} not found`,
      );
    }
    return posts;
  }

  async deleteAttachmentById(
    attachmentId: number,
    post_id: number,
  ): Promise<boolean> {
    await this.relationshipPostFileRepository.delete(attachmentId);

    const post = await this.findPostById(post_id);

    if (
      post.plain_text.trim() === '' &&
      post.quill_text === '' &&
      post.files.length === 0
    ) {
      await this.delete(post_id, post.user_id);
    }

    return true;
  }

  async deletePostsByDiscussionId(discussionId: number): Promise<boolean> {
    await this.postRepository.delete({ discussion_id: discussionId });
    return true;
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const post = await this.postRepository.findOne({
      where: {
        id,
        user_id: userId,
      },
    });

    if (!post) {
      return false;
    }

    await this.postRepository.delete(id);
    return true;
  }
}
