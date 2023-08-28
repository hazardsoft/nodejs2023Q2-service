import { Album } from '@prisma/client';
import GenericRepository from 'src/db/repository';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export default class AlbumRepository extends GenericRepository<
  Album,
  CreateAlbumDto,
  CreateAlbumDto
> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findOne(id: string): Promise<Album> {
    return this.prisma.findAlbum(id);
  }

  async findMany(): Promise<Album[]> {
    return this.prisma.findAlbums();
  }

  async findSome(ids: string[]): Promise<Album[]> {
    return this.prisma.findSomeAlbums(ids);
  }

  async create(dto: CreateAlbumDto): Promise<Album> {
    return this.prisma.createAlbum(dto);
  }

  async update(id: string, dto: CreateAlbumDto): Promise<Album> {
    return this.prisma.updateAlbum(id, dto);
  }

  async delete(id: string): Promise<Album> {
    return this.prisma.removeAlbum(id);
  }
}
