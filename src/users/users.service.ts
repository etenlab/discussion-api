import { Injectable, ConflictException } from '@nestjs/common';
import { User } from './user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(email: string, username: string): Promise<User> {
    const exist = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (exist) {
      throw new ConflictException(email);
    }

    const user = this.userRepository.create({
      email,
      username,
      password: 'password',
    });
    return await this.userRepository.save(user);
  }
}
