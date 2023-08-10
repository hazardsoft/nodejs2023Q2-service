import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Artist } from './entities/artist.entity';
import { plainToInstance } from 'class-transformer';
import ArtistRepository from './artist.repository';

@Injectable()
export class ArtistService {
  constructor(private readonly repository: ArtistRepository) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    return plainToInstance(
      Artist,
      await this.repository.create(createArtistDto),
    );
  }

  async findAll(): Promise<Artist[]> {
    return plainToInstance(Artist, await this.repository.findMany());
  }

  async findOne(id: string): Promise<Artist> {
    return plainToInstance(Artist, await this.repository.findOne(id));
  }

  async findSome(ids: string[]): Promise<Artist[]> {
    return plainToInstance(Artist, await this.repository.findSome(ids));
  }

  async update(id: string, updateArtistDto: CreateArtistDto): Promise<Artist> {
    return plainToInstance(
      Artist,
      await this.repository.update(id, updateArtistDto),
    );
  }

  async remove(id: string): Promise<Artist> {
    return plainToInstance(Artist, await this.repository.delete(id));
  }
}
