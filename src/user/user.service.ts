import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { IncorrectPasswordError } from './errors';
import { plainToInstance } from 'class-transformer';
import UserRepository from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return plainToInstance(User, await this.repository.create(createUserDto));
  }

  async findAll(): Promise<User[]> {
    return plainToInstance(User, await this.repository.findMany());
  }

  async findOne(id: string): Promise<User | undefined> {
    return plainToInstance(User, await this.repository.findOne(id));
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User | undefined> {
    const user = await this.repository.findOne(id);
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new IncorrectPasswordError();
    }
    return plainToInstance(
      User,
      await this.repository.update(id, updatePasswordDto),
    );
  }

  async remove(id: string): Promise<User | undefined> {
    return plainToInstance(User, await this.repository.delete(id));
  }
}
