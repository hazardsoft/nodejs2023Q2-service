import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Artist } from './entities/artist.entity';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/db/prisma.service';
import { FavsService } from 'src/favs/favs.service';

@Injectable()
export class ArtistService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly favoritesService: FavsService,
  ) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    return plainToInstance(
      Artist,
      await this.prismaService.createArtist(createArtistDto),
    );
  }

  async findAll(): Promise<Artist[]> {
    return plainToInstance(Artist, await this.prismaService.findArtists());
  }

  async findOne(id: string): Promise<Artist> {
    return plainToInstance(Artist, await this.prismaService.findArtist(id));
  }

  async update(id: string, updateArtistDto: CreateArtistDto): Promise<Artist> {
    return plainToInstance(
      Artist,
      await this.prismaService.updateArtist(id, updateArtistDto),
    );
  }

  async remove(id: string): Promise<Artist> {
    try {
      await this.favoritesService.removeArtist(id);
    } catch (e) {}

    return plainToInstance(Artist, await this.prismaService.removeArtist(id));
  }
}
