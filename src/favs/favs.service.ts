import { Injectable } from '@nestjs/common';
import { Fav } from './entities/fav.entity';
import { FavNotFoundError } from './errors';

@Injectable()
export class FavsService {
  private readonly favs: Fav = new Fav();

  constructor() {
    this.favs.albums = [];
    this.favs.artists = [];
    this.favs.tracks = [];
  }

  async findAll(): Promise<Fav> {
    return this.favs;
  }

  async createTrack(id: string): Promise<boolean> {
    this.favs.tracks.push(id);
    return true;
  }

  async createAlbum(id: string): Promise<boolean> {
    this.favs.albums.push(id);
    return true;
  }

  async createArtist(id: string): Promise<boolean> {
    this.favs.artists.push(id);
    return true;
  }

  async removeTrack(id: string): Promise<string> {
    const foundIndex = this.favs.tracks.findIndex((t) => t === id);
    if (foundIndex === -1) {
      throw new FavNotFoundError(id, 'track');
    }
    const removedId = this.favs.tracks.splice(foundIndex, 1).shift();
    return removedId;
  }

  async removeAlbum(id: string): Promise<string> {
    const foundIndex = this.favs.albums.findIndex((t) => t === id);
    if (foundIndex === -1) {
      throw new FavNotFoundError(id, 'album');
    }
    const removedId = this.favs.albums.splice(foundIndex, 1).shift();
    return removedId;
  }

  async removeArtist(id: string): Promise<string> {
    const foundIndex = this.favs.artists.findIndex((t) => t === id);
    if (foundIndex === -1) {
      throw new FavNotFoundError(id, 'artist');
    }
    const removedId = this.favs.artists.splice(foundIndex, 1).shift();
    return removedId;
  }
}
