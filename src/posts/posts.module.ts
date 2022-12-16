import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';
import { DiscussionsService } from 'src/discussions/discussions.service';
import { Post } from './post.model';
import { Discussion } from 'src/discussions/discussion.model';
import { RelationshipPostFile } from './relationship-post-file.model';
import { File } from './file.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Discussion, RelationshipPostFile, File]),
  ],
  providers: [PostsResolver, PostsService, DiscussionsService],
  exports: [PostsService],
})
export class PostsModule {}
