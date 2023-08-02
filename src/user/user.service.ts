import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { PrismaService } from 'src/db/prisma.service';
import { IncorrectPasswordError } from './errors';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return plainToInstance(
      User,
      await this.prismaService.createUser(createUserDto),
    );
  }

  async findAll(): Promise<User[]> {
    return plainToInstance(User, await this.prismaService.findUsers());
  }

  async findOne(id: string): Promise<User | undefined> {
    return plainToInstance(User, await this.prismaService.findUser(id));
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User | undefined> {
    const user = await this.prismaService.findUser(id);
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new IncorrectPasswordError();
    }
    return plainToInstance(
      User,
      await this.prismaService.updateUserPassword(id, updatePasswordDto),
    );
  }

  async remove(id: string): Promise<User | undefined> {
    return plainToInstance(User, await this.prismaService.removeUser(id));
  }
}
