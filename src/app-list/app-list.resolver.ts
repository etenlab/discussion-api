import { Injectable } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppList } from './app-list.model';
import { AppListService } from './app-list.service';

@Resolver(() => AppList)
@Injectable()
export class AppListResolver {
  constructor(private readonly appListService: AppListService) {}

  @Mutation(() => AppList)
  async createApp(
    @Args('app_name', { type: () => String }) app_name: string,
  ): Promise<AppList> {
    const app = await this.appListService.create(app_name);
    return app;
  }

  @Query(() => AppList)
  async getApp(
    @Args('app_name', { type: () => String }) app_name: string,
  ): Promise<AppList> {
    const app = await this.appListService.getApp(app_name);
    return app;
  }
}
