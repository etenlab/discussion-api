import { Module } from '@nestjs/common';
import { DiscussionsResolver } from './discussions.resolver';
import { DiscussionsService } from './discussions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discussion } from './discussion.model';
import { Post } from '../posts/post.model';
import { AppList } from '../app-list/app-list.model';
import { Organization } from '../organization/organizations.model';
@Module({
  imports: [
    TypeOrmModule.forFeature([Discussion, Post, AppList, Organization]),
  ],
  providers: [DiscussionsResolver, DiscussionsService],
})
export class DiscussionsModule {}
