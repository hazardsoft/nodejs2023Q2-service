import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Track, User } from '@prisma/client';
import { CreateTrackDto } from 'src/track/dto/create-track.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdatePasswordDto } from 'src/user/dto/update-password.dto';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async findUser(id: string): Promise<User> {
    return await this.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async findTrack(id: string): Promise<Track> {
    return await this.track.findFirstOrThrow({
      where: {
        id,
      },
    });
  }

  async findUsers(): Promise<User[]> {
    return await this.user.findMany();
  }

  async findTracks(): Promise<Track[]> {
    return await this.track.findMany();
  }

  async createUser(createDto: CreateUserDto): Promise<User> {
    return await this.user.create({
      data: createDto,
    });
  }

  async createTrack(createDto: CreateTrackDto): Promise<Track> {
    return await this.track.create({
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

  async updateTrack(id: string, updateDto: CreateTrackDto): Promise<Track> {
    return await this.track.update({
      where: {
        id,
      },
      data: updateDto,
    });
  }

  async removeUser(id: string): Promise<User> {
    return await this.user.delete({
      where: {
        id,
      },
    });
  }

  async removeTrack(id: string): Promise<Track> {
    return await this.track.delete({
      where: {
        id,
      },
    });
  }
}
