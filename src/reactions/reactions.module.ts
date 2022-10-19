import { Module } from '@nestjs/common';
import { ReactionsResolver } from './reactions.resolver';
import { ReactionsService } from './reactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reaction } from './reaction.model';

@Module({
  imports: [TypeOrmModule.forFeature([Reaction])],
  providers: [ReactionsResolver, ReactionsService],
})
export class ReactionsModule {}
