import { Injectable, NotFoundException } from '@nestjs/common';
import { DiscussionInput } from './discussion.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Discussion } from './discussion.model';
import { Post } from '../posts/post.model';
import { DiscussionSummary } from './dto/DiscussionSummary';
import { AppList } from '../app-list/app-list.model';
import { Organization } from '../organization/organizations.model';

@Injectable()
export class DiscussionsService {
  constructor(
    @InjectRepository(Discussion)
    private discussionRepository: Repository<Discussion>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(AppList)
    private appListRepository: Repository<AppList>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  async create(data: DiscussionInput): Promise<Discussion> {
    const app = await this.appListRepository.findOne({
      where: {
        id: data.app_id,
      },
    });

    if (!app) {
      throw new NotFoundException(`Not exists app id #${data.app_id}`);
    }

    const org = await this.organizationRepository.findOne({
      where: {
        id: data.org_id,
      },
    });

    if (!org) {
      throw new NotFoundException(`Not exists app id #${data.app_id}`);
    }

    const discussion = await this.discussionRepository.findOne({
      where: {
        table_name: data.table_name,
        row: data.row,
        app: data.app_id,
        org: data.org_id,
      },
    });

    if (discussion) {
      return discussion;
    }

    const newDiscussion = this.discussionRepository.create({
      table_name: data.table_name,
      row: data.row,
      app: data.app_id,
      org: data.org_id,
    });
    return await this.discussionRepository.save(newDiscussion);
  }

  async findOneById(discussionId: number): Promise<Discussion> {
    const discussion = this.discussionRepository.findOne({
      relations: [
        'posts',
        'posts.user',
        'posts.reply',
        'posts.reply.user',
        'posts.reply.files',
        'posts.reactions',
        'posts.reactions.user',
        'posts.files',
        'posts.files.file',
        'appList',
        'organization',
      ],
      where: { id: discussionId },
    });
    if (!discussion) {
      throw new NotFoundException(`Discussion #${discussionId} not found`);
    }
    return discussion;
  }

  async findWithParams({
    table_name,
    row,
    app_id,
    org_id,
  }: {
    table_name: string;
    row: number;
    app_id: number;
    org_id: number;
  }): Promise<Discussion[]> {
    const discussions = this.discussionRepository.find({
      relations: [
        'posts',
        'posts.user',
        'posts.reply',
        'posts.reply.user',
        'posts.reply.files',
        'posts.reactions',
        'posts.reactions.user',
        'posts.files',
        'posts.files.file',
        'appList',
        'organization',
      ],
      order: {
        posts: {
          created_at: 'ASC',
        },
      },
      where: {
        table_name: table_name,
        row: row,
        app: app_id,
        org: org_id,
      },
    });
    if (!discussions) {
      throw new NotFoundException(
        `Discussion not found by table name#${table_name}, row#${row}`,
      );
    }
    return discussions;
  }

  async getDiscussionsSummaryByUserId(
    userId: number,
  ): Promise<DiscussionSummary[]> {
    const discussionIds = await this.postRepository
      .createQueryBuilder('admin.posts')
      .select('count(discussion_id) as total_posts, discussion_id')
      .where('user_id = :userId', {
        userId,
      })
      .groupBy('discussion_id')
      .execute();

    const discussions = await this.discussionRepository.findBy({
      id: In([...discussionIds.map((item) => item.discussion_id)]),
    });

    // Following code will cause performance issue, should be updated.
    // I (hiroshi) am going to use this approach because we are in v2 step.
    return discussions.map((discussion) => {
      const total_posts = discussionIds.find(
        (item) => item.discussion_id === discussion.id,
      ).total_posts;

      return {
        id: discussion.id,
        table_name: discussion.table_name,
        row: discussion.row,
        total_posts,
      } as DiscussionSummary;
    });
  }

  async delete(id: number): Promise<boolean> {
    await this.discussionRepository.delete({ id });
    return true;
  }
}
