import { Module } from '@nestjs/common';
import { OrganizationResolver } from './organization.resolver';
import { OrganizationService } from './organization.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './organizations.model';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  providers: [OrganizationResolver, OrganizationService],
})
export class OrganizationsModule {}
