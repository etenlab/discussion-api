import { Injectable, ConflictException } from '@nestjs/common';
import { Organization } from './organizations.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private orgRepository: Repository<Organization>,
  ) {}

  async create(name: string): Promise<Organization> {
    const exist = await this.orgRepository.findOne({
      where: {
        name,
      },
    });

    if (exist) {
      throw new ConflictException(name);
    }

    const org = this.orgRepository.create({
      name,
    });
    return await this.orgRepository.save(org);
  }

  async getOrg(name: string): Promise<Organization> {
    const org = await this.orgRepository.findOne({
      where: {
        name,
      },
    });

    if (org) {
      return org;
    }

    const newOrg = this.orgRepository.create({
      name,
    });
    return await this.orgRepository.save(newOrg);
  }
}
