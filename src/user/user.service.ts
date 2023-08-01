import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { PrismaService } from 'src/prisma.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const rawUser = await this.prismaService.user.create({
      data: createUserDto,
    });
    return rawUser ? plainToInstance(User, rawUser) : null;
  }

  async findAll(): Promise<User[]> {
    const rawUsers = await this.prismaService.user.findMany();
    return rawUsers.map((u) => plainToInstance(User, u));
  }

  async findOne(id: string): Promise<User | undefined> {
    const rawUser = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    return rawUser ? plainToInstance(User, rawUser) : undefined;
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User | undefined> {
    const rawUser = await this.prismaService.user.update({
      where: {
        id,
        password: updatePasswordDto.oldPassword,
      },
      data: updatePasswordDto,
    });
    return rawUser ? plainToInstance(User, rawUser) : undefined;
  }

  async remove(id: string): Promise<User | undefined> {
    const rawUser = await this.prismaService.user.delete({
      where: {
        id,
      },
    });
    return rawUser ? plainToInstance(User, rawUser) : undefined;
  }
}
