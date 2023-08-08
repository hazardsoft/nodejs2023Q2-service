import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { IncorrectPasswordError, UserNotFoundError } from './errors';

@Injectable()
export class UserService {
  private readonly users: User[] = [];

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.id = uuidv4();
    user.login = createUserDto.login;
    user.password = createUserDto.password;
    user.version = 1;
    user.createdAt = user.updatedAt = new Date().getTime();

    this.users.push(user);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.users.slice();
  }

  async findOne(id: string): Promise<User | undefined> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new UserNotFoundError(id);
    }
    return user;
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User | undefined> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new UserNotFoundError(id);
    }
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new IncorrectPasswordError();
    }
    user.version++;
    user.password = updatePasswordDto.newPassword;
    user.updatedAt = new Date().getTime();
    return user;
  }

  async remove(id: string): Promise<User | undefined> {
    const foundIndex = this.users.findIndex((u) => u.id === id);
    if (foundIndex === -1) {
      throw new UserNotFoundError(id);
    }
    const user = this.users.splice(foundIndex, 1).shift();
    return user;
  }
}
