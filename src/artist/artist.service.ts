import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Artist } from './entities/artist.entity';
import { ArtistNotFoundError } from './errors';

@Injectable()
export class ArtistService {
  private readonly artists: Artist[] = [];

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const artist = new Artist();
    artist.id = uuidv4();
    Object.assign(artist, createArtistDto);

    this.artists.push(artist);
    return artist;
  }

  async findAll(): Promise<Artist[]> {
    return this.artists.slice();
  }

  async findOne(id: string): Promise<Artist | undefined> {
    const artist = this.artists.find((a) => a.id === id);
    if (!artist) {
      throw new ArtistNotFoundError(id);
    }
    return artist;
  }

  async update(
    id: string,
    updateArtistDto: CreateArtistDto,
  ): Promise<Artist | undefined> {
    const artist = this.artists.find((a) => a.id === id);
    if (!artist) {
      throw new ArtistNotFoundError(id);
    }
    Object.assign(artist, updateArtistDto);
    return artist;
  }

  async remove(id: string): Promise<Artist | undefined> {
    const foundIndex = this.artists.findIndex((u) => u.id === id);
    if (foundIndex === -1) {
      throw new ArtistNotFoundError(id);
    }
    const artist = this.artists.splice(foundIndex, 1).shift();

    return artist;
  }
}
