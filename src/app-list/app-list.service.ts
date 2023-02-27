import { Injectable, ConflictException } from '@nestjs/common';
import { AppList } from './app-list.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AppListService {
  constructor(
    @InjectRepository(AppList)
    private appListRepository: Repository<AppList>,
  ) {}

  async create(app_name: string): Promise<AppList> {
    const exist = await this.appListRepository.findOne({
      where: {
        app_name,
      },
    });

    if (exist) {
      throw new ConflictException(app_name);
    }

    const app = this.appListRepository.create({
      app_name,
    });
    return await this.appListRepository.save(app);
  }

  async getApp(app_name: string): Promise<AppList> {
    const app = await this.appListRepository.findOne({
      where: {
        app_name,
      },
    });

    if (app) {
      return app;
    }

    const newApp = this.appListRepository.create({
      app_name,
    });
    return await this.appListRepository.save(newApp);
  }
}
