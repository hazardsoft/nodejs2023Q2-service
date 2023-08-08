import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from './entities/track.entity';
import { TrackNotFoundError } from './errors';

@Injectable()
export class TrackService {
  private readonly tracks: Track[] = [];

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const track = new Track();
    track.id = uuidv4();
    Object.assign(track, createTrackDto);

    this.tracks.push(track);
    return track;
  }

  async findAll(): Promise<Track[]> {
    return this.tracks.slice();
  }

  async findOne(id: string): Promise<Track | undefined> {
    const track = this.tracks.find((u) => u.id === id);
    if (!track) {
      throw new TrackNotFoundError(id);
    }
    return track;
  }

  async update(
    id: string,
    updateTrackDto: CreateTrackDto,
  ): Promise<Track | undefined> {
    const track = this.tracks.find((u) => u.id === id);
    if (!track) {
      throw new TrackNotFoundError(id);
    }
    Object.assign(track, updateTrackDto);
    return track;
  }

  async remove(id: string): Promise<Track | undefined> {
    const foundIndex = this.tracks.findIndex((u) => u.id === id);
    if (foundIndex === -1) {
      throw new TrackNotFoundError(id);
    }
    const track = this.tracks.splice(foundIndex, 1).shift();
    return track;
  }
}
