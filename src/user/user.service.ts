import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { IncorrectPasswordError, UserNotFoundError } from './errors';
import { PrismaService } from 'src/prisma.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const rawUser = await this.prismaService.user.create({
      data: createUserDto,
    });
    const user = plainToInstance(User, rawUser);
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  async findOne(id: string): Promise<User | undefined> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });
      return user;
    } catch (e) {
      throw new UserNotFoundError(id);
    }
    return undefined;
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User | undefined> {
    try {
      const user = await this.prismaService.user.update({
        where: {
          id,
          password: updatePasswordDto.oldPassword,
        },
        data: updatePasswordDto,
      });
      return user;
    } catch (e) {
      throw new UserNotFoundError(id);
      throw new IncorrectPasswordError();
    }
    return undefined;
  }

  async remove(id: string): Promise<User | undefined> {
    try {
      const removedUser = await this.prismaService.user.delete({
        where: {
          id,
        },
      });
      return removedUser;
    } catch (e) {
      throw new UserNotFoundError(id);
    }
    return undefined;
  }
}
