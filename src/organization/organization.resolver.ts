import { Injectable } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Organization } from './organizations.model';
import { OrganizationService } from './organization.service';

@Resolver(() => Organization)
@Injectable()
export class OrganizationResolver {
  constructor(private readonly organizationService: OrganizationService) {}

  @Mutation(() => Organization)
  async createOrg(
    @Args('name', { type: () => String }) name: string,
  ): Promise<Organization> {
    const org = await this.organizationService.create(name);
    return org;
  }

  @Query(() => Organization)
  async getOrg(
    @Args('name', { type: () => String }) name: string,
  ): Promise<Organization> {
    const org = await this.organizationService.getOrg(name);
    return org;
  }
}
