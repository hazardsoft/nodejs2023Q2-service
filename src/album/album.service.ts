import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album } from './entities/album.entity';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/db/prisma.service';
import { FavsService } from 'src/favs/favs.service';

@Injectable()
export class AlbumService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly favoritesService: FavsService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    return plainToInstance(
      Album,
      await this.prismaService.createAlbum(createAlbumDto),
    );
  }

  async findAll(): Promise<Album[]> {
    return plainToInstance(Album, await this.prismaService.findAlbums());
  }

  async findOne(id: string): Promise<Album> {
    return plainToInstance(Album, await this.prismaService.findAlbum(id));
  }

  async update(id: string, updateAlbumDto: CreateAlbumDto): Promise<Album> {
    return plainToInstance(
      Album,
      await this.prismaService.updateAlbum(id, updateAlbumDto),
    );
  }

  async remove(id: string): Promise<Album> {
    try {
      await this.favoritesService.removeAlbum(id);
    } catch (e) {}

    return plainToInstance(Album, this.prismaService.removeAlbum(id));
  }
}
