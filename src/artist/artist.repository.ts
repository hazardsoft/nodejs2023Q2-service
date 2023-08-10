import { Artist } from '@prisma/client';
import GenericRepository from 'src/db/repository';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export default class ArtistRepository extends GenericRepository<
  Artist,
  CreateArtistDto,
  CreateArtistDto
> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findOne(id: string): Promise<Artist> {
    return this.prisma.findArtist(id);
  }

  async findMany(): Promise<Artist[]> {
    return this.prisma.findArtists();
  }

  async findSome(ids: string[]): Promise<Artist[]> {
    return this.prisma.findSomeArtists(ids);
  }

  async create(dto: CreateArtistDto): Promise<Artist> {
    return this.prisma.createArtist(dto);
  }

  async update(id: string, dto: CreateArtistDto): Promise<Artist> {
    return this.prisma.updateArtist(id, dto);
  }

  async delete(id: string): Promise<Artist> {
    return this.prisma.removeArtist(id);
  }
}
