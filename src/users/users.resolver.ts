import { Injectable } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { User } from './user.model';
import { UsersService } from './users.service';

@Resolver(() => User)
@Injectable()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(
    @Args('email', { type: () => String }) email: string,
    @Args('username', { type: () => String }) username: string,
  ): Promise<User> {
    const user = await this.usersService.create(email, username);
    return user;
  }

  @Query(() => User)
  async getUserIdFromEmail(
    @Args('email', { type: () => String }) email: string,
  ): Promise<User> {
    const user = await this.usersService.getUserFromEmail(email);
    return user;
  }

  @Query(() => User)
  async getUserIdFromName(
    @Args('name', { type: () => String }) name: string,
  ): Promise<User> {
    const user = await this.usersService.getUserFromName(name);
    return user;
  }
}
