import { Injectable } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
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
}
