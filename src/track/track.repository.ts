import { Track } from '@prisma/client';
import GenericRepository from 'src/db/repository';
import { CreateTrackDto } from './dto/create-track.dto';
import { PrismaService } from 'src/db/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class TrackRepository extends GenericRepository<
  Track,
  CreateTrackDto,
  CreateTrackDto
> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findOne(id: string): Promise<Track> {
    return this.prisma.findTrack(id);
  }

  async findMany(): Promise<Track[]> {
    return this.prisma.findTracks();
  }

  async findSome(ids: string[]): Promise<Track[]> {
    return this.prisma.findSomeTracks(ids);
  }

  async create(dto: CreateTrackDto): Promise<Track> {
    return this.prisma.createTrack(dto);
  }

  async update(id: string, dto: CreateTrackDto): Promise<Track> {
    return this.prisma.updateTrack(id, dto);
  }

  async delete(id: string): Promise<Track> {
    return this.prisma.removeTrack(id);
  }
}
