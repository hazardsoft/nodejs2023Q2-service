import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { PrismaService } from 'src/db/prisma.service';
import { plainToInstance } from 'class-transformer';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { IncorrectPasswordError, UserNotFoundError } from './errors';
import { PrismaErrors } from 'src/db/errors';

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
    try {
      const rawUser = await this.prismaService.user.findUniqueOrThrow({
        where: {
          id,
        },
      });
      return plainToInstance(User, rawUser);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        switch (e.code) {
          case PrismaErrors.NOT_FOUND:
            throw new UserNotFoundError(id);
        }
      }
      throw e;
    }
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User | undefined> {
    try {
      const foundUser = await this.prismaService.user.findUniqueOrThrow({
        where: {
          id,
        },
      });
      if (foundUser && foundUser.password !== updatePasswordDto.oldPassword) {
        throw new IncorrectPasswordError();
      }
      const updatedUser = await this.prismaService.user.update({
        where: {
          id,
        },
        data: {
          version: {
            increment: 1,
          },
          updatedAt: new Date(),
          password: updatePasswordDto.newPassword,
        },
      });
      return plainToInstance(User, updatedUser);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        switch (e.code) {
          case PrismaErrors.NOT_FOUND:
            throw new UserNotFoundError(id);
        }
      }
      throw e;
    }
  }

  async remove(id: string): Promise<User | undefined> {
    try {
      const rawUser = await this.prismaService.user.delete({
        where: {
          id,
        },
      });
      return plainToInstance(User, rawUser);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        switch (e.code) {
          case PrismaErrors.NOT_FOUND:
            throw new UserNotFoundError(id);
        }
      }
      throw e;
    }
  }
}
