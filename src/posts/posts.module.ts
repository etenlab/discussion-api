import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';
import { DiscussionsService } from '../discussions/discussions.service';
import { Post } from './post.model';
import { Discussion } from '../discussions/discussion.model';
import { RelationshipPostFile } from './relationship-post-file.model';
import { File } from './file.model';
import { AppList } from 'src/app-list/app-list.model';
import { Organization } from 'src/organization/organizations.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      Discussion,
      RelationshipPostFile,
      File,
      AppList,
      Organization,
    ]),
  ],
  providers: [PostsResolver, PostsService, DiscussionsService],
  exports: [PostsService],
})
export class PostsModule {}
