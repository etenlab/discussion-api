import { Injectable, NotFoundException } from '@nestjs/common';
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
    const discussion = this.discussionRepository.create(data);
    return await this.discussionRepository.save(discussion);
  }

  async findOneById(discussionId: number): Promise<Discussion> {
    const discussion = this.discussionRepository.findOne({ where: { id: discussionId } });
    if (!discussion) {
      throw new NotFoundException(`Discussion #${discussionId} not found`);
    }
    return discussion;
  }

  async findByTableRow(tableName: string, rowId: number): Promise<Discussion[]> {
    const discussions = this.discussionRepository.find({ where: { table_name: tableName, row: rowId } });
    if (!discussions) {
      throw new NotFoundException(`Discussion not found by table#${tableName}, row#${rowId}`);
    }
    return discussions;
  }

  async remove(discussionId: number): Promise<boolean> {
    const discussion = await this.discussionRepository.findOne({ where: { id: discussionId } });
    if (!discussion) {
      throw new NotFoundException(`Discussion #${discussionId} not found`);
    }
    await this.discussionRepository.remove(discussion);
    return true;
  }
}
