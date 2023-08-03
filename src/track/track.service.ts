import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from './entities/track.entity';
import { PrismaService } from 'src/db/prisma.service';
import { plainToInstance } from 'class-transformer';
import { FavsService } from 'src/favs/favs.service';

@Injectable()
export class TrackService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly favoritesService: FavsService,
  ) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    return plainToInstance(
      Track,
      await this.prismaService.createTrack(createTrackDto),
    );
  }

  async findAll(): Promise<Track[]> {
    return plainToInstance(Track, await this.prismaService.findTracks());
  }

  async findOne(id: string): Promise<Track> {
    return plainToInstance(Track, await this.prismaService.findTrack(id));
  }

  async update(id: string, updateTrackDto: CreateTrackDto): Promise<Track> {
    return plainToInstance(
      Track,
      await this.prismaService.updateTrack(id, updateTrackDto),
    );
  }

  async remove(id: string): Promise<Track> {
    try {
      await this.favoritesService.removeTrack(id);
    } catch (e) {}

    return plainToInstance(Track, await this.prismaService.removeTrack(id));
  }
}
