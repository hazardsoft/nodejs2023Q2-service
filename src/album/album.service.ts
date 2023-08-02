import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album } from './entities/album.entity';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private readonly prismaService: PrismaService) {}

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
    return plainToInstance(Album, this.prismaService.removeAlbum(id));
  }
}
