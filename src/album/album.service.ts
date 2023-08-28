import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album } from './entities/album.entity';
import { plainToInstance } from 'class-transformer';
import AlbumRepository from './album.repository';

@Injectable()
export class AlbumService {
  constructor(private readonly repository: AlbumRepository) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    return plainToInstance(Album, await this.repository.create(createAlbumDto));
  }

  async findAll(): Promise<Album[]> {
    return plainToInstance(Album, await this.repository.findMany());
  }

  async findOne(id: string): Promise<Album> {
    return plainToInstance(Album, await this.repository.findOne(id));
  }

  async findSome(ids: string[]): Promise<Album[]> {
    return plainToInstance(Album, await this.repository.findSome(ids));
  }

  async update(id: string, updateAlbumDto: CreateAlbumDto): Promise<Album> {
    return plainToInstance(
      Album,
      await this.repository.update(id, updateAlbumDto),
    );
  }

  async remove(id: string): Promise<Album> {
    return plainToInstance(Album, this.repository.delete(id));
  }
}
