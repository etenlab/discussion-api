import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReactionsResolver } from './reactions.resolver';
import { ReactionsService } from './reactions.service';
import { Reaction } from './reaction.model';

import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reaction]), PostsModule],
  providers: [ReactionsResolver, ReactionsService],
})
export class ReactionsModule {}
