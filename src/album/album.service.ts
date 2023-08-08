import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album } from './entities/album.entity';
import { AlbumNotFoundError } from './errors';

@Injectable()
export class AlbumService {
  private readonly albums: Album[] = [];

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const album = new Album();
    album.id = uuidv4();
    Object.assign(album, createAlbumDto);

    this.albums.push(album);
    return album;
  }

  async findAll(): Promise<Album[]> {
    return this.albums.slice();
  }

  async findOne(id: string): Promise<Album | undefined> {
    const album = this.albums.find((a) => a.id === id);
    if (!album) {
      throw new AlbumNotFoundError(id);
    }
    return album;
  }

  async update(
    id: string,
    updateAlbumDto: CreateAlbumDto,
  ): Promise<Album | undefined> {
    const album = this.albums.find((a) => a.id === id);
    if (!album) {
      throw new AlbumNotFoundError(id);
    }
    Object.assign(album, updateAlbumDto);
    return album;
  }

  async remove(id: string): Promise<Album | undefined> {
    const foundIndex = this.albums.findIndex((u) => u.id === id);
    if (foundIndex === -1) {
      throw new AlbumNotFoundError(id);
    }
    const album = this.albums.splice(foundIndex, 1).shift();
    return album;
  }
}
