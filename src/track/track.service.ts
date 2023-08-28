import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from './entities/track.entity';
import { plainToInstance } from 'class-transformer';
import TrackRepository from './track.repository';

@Injectable()
export class TrackService {
  constructor(private readonly repository: TrackRepository) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    return plainToInstance(Track, await this.repository.create(createTrackDto));
  }

  async findAll(): Promise<Track[]> {
    return plainToInstance(Track, await this.repository.findMany());
  }

  async findOne(id: string): Promise<Track> {
    return plainToInstance(Track, await this.repository.findOne(id));
  }

  async findSome(ids: string[]): Promise<Track[]> {
    return plainToInstance(Track, await this.repository.findSome(ids));
  }

  async update(id: string, updateTrackDto: CreateTrackDto): Promise<Track> {
    return plainToInstance(
      Track,
      await this.repository.update(id, updateTrackDto),
    );
  }

  async remove(id: string): Promise<Track> {
    return plainToInstance(Track, await this.repository.delete(id));
  }
}
