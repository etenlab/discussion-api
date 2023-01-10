import { Module } from '@nestjs/common';
import { DiscussionsResolver } from './discussions.resolver';
import { DiscussionsService } from './discussions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discussion } from './discussion.model';
import { Post } from '../posts/post.model';

@Module({
  imports: [TypeOrmModule.forFeature([Discussion, Post])],
  providers: [DiscussionsResolver, DiscussionsService],
})
export class DiscussionsModule {}
