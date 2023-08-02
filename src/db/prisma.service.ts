import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdatePasswordDto } from 'src/user/dto/update-password.dto';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async findUser(id: string): Promise<User | undefined> {
    return await this.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async findUsers(): Promise<User[]> {
    return await this.user.findMany();
  }

  async createUser(createDto: CreateUserDto): Promise<User | undefined> {
    return await this.user.create({
      data: createDto,
    });
  }

  async updateUserPassword(
    id: string,
    updateDto: UpdatePasswordDto,
  ): Promise<User | undefined> {
    return await this.user.update({
      where: {
        id,
      },
      data: {
        version: {
          increment: 1,
        },
        updatedAt: new Date(),
        password: updateDto.newPassword,
      },
    });
  }

  async removeUser(id: string): Promise<User | undefined> {
    return await this.user.delete({
      where: {
        id,
      },
    });
  }
}
