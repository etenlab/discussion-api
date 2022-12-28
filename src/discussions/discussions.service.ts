import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { NewDiscussionInput } from './new-discussion.input';
import { Discussion } from './discussion.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DiscussionsService {
  constructor(
    @InjectRepository(Discussion)
    private discussionRepository: Repository<Discussion>,
  ) {}

  async create(data: NewDiscussionInput): Promise<Discussion> {
    const discussions = await this.discussionRepository.find({
      where: { table_name: data.table_name, row: data.row },
    });

    if (discussions.length > 0) {
      throw new HttpException(
        `Already exists Discussion table_name="${data.table_name}" row="${data.row}"`,
        HttpStatus.CONFLICT,
      );
    }

    const discussion = this.discussionRepository.create(data);
    return await this.discussionRepository.save(discussion);
  }

  async findOneById(discussionId: number): Promise<Discussion> {
    const discussion = this.discussionRepository.findOne({
      relations: [
        'posts',
        'posts.user',
        'posts.reactions',
        'posts.reactions.user',
        'posts.files',
        'posts.files.file',
      ],
      where: { id: discussionId },
    });
    if (!discussion) {
      throw new NotFoundException(`Discussion #${discussionId} not found`);
    }
    return discussion;
  }

  async findByTableNameAndRow(
    table_name: string,
    row: number,
  ): Promise<Discussion[]> {
    const discussions = this.discussionRepository.find({
      relations: [
        'posts',
        'posts.user',
        'posts.reactions',
        'posts.reactions.user',
        'posts.files',
        'posts.files.file',
      ],
      order: {
        posts: {
          created_at: 'ASC',
        },
      },
      where: { table_name, row },
    });
    if (!discussions) {
      throw new NotFoundException(
        `Discussion not found by table name#${table_name}, row#${row}`,
      );
    }
    return discussions;
  }

  async delete(id: number): Promise<boolean> {
    await this.discussionRepository.delete({ id });
    return true;
  }
}
