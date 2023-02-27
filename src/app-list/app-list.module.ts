import { Module } from '@nestjs/common';
import { AppListResolver } from './app-list.resolver';
import { AppListService } from './app-list.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppList } from './app-list.model';

@Module({
  imports: [TypeOrmModule.forFeature([AppList])],
  providers: [AppListResolver, AppListService],
})
export class AppListModule {}
