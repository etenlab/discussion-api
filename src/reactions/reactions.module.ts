import { Module } from '@nestjs/common';
import { ReactionsResolver } from './reactions.resolver';
import { ReactionsService } from './reactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reaction } from './reaction.model';
import { Post } from 'src/posts/post.model';
import { PostsService } from 'src/posts/posts.service';
import { RelationshipPostFile } from 'src/posts/relationship-post-file.model';

@Module({
  imports: [TypeOrmModule.forFeature([Reaction, Post, RelationshipPostFile])],
  providers: [ReactionsResolver, ReactionsService, PostsService],
})
export class ReactionsModule {}
