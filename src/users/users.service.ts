import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private reactionRepository: Repository<User>,
  ) {}

  async create(email: string): Promise<User> {
    const user = this.reactionRepository.create({
      email,
      password: 'password',
    });
    return await this.reactionRepository.save(user);
  }
}
