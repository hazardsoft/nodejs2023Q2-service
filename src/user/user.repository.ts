import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import GenericRepository from 'src/db/repository';

@Injectable()
export default class UserRepository extends GenericRepository<
  User,
  CreateUserDto,
  UpdatePasswordDto
> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findOne(id: string): Promise<User> {
    return this.prisma.findUser(id);
  }

  async findOneByLogin(login: string): Promise<User> {
    return this.prisma.findUserByLogin(login);
  }

  async findMany(): Promise<User[]> {
    return this.prisma.findUsers();
  }

  async findSome(ids: string[]): Promise<User[]> {
    return this.prisma.findSomeUsers(ids);
  }

  async create(dto: CreateUserDto): Promise<User> {
    return this.prisma.createUser(dto);
  }

  async update(id: string, dto: UpdatePasswordDto): Promise<User> {
    return this.prisma.updateUserPassword(id, dto);
  }

  async delete(id: string): Promise<User> {
    return this.prisma.removeUser(id);
  }
}
