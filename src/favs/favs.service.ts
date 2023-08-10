import { Injectable } from '@nestjs/common';
import { Favorites } from './entities/fav.entity';
import { plainToInstance } from 'class-transformer';
import { FavoritesCreateError, FavoritesDeleteError } from './errors';
import FavoritesRepository from './favs.repository';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';

@Injectable()
export class FavsService {
  constructor(
    private readonly repository: FavoritesRepository,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
  ) {}

  async findAll(): Promise<Favorites> {
    const favoritesIds = await this.repository.getFavoritesIds();
    const tracks = await this.trackService.findSome(favoritesIds.tracks);
    const albums = await this.albumService.findSome(favoritesIds.albums);
    const artists = await this.artistService.findSome(favoritesIds.artists);
    return plainToInstance(Favorites, {
      tracks,
      albums,
      artists,
    });
  }

  async createTrack(id: string): Promise<void> {
    try {
      await this.repository.createTrack(id);
    } catch (e) {
      throw new FavoritesCreateError();
    }
  }

  async createAlbum(id: string): Promise<void> {
    try {
      await this.repository.createAlbum(id);
    } catch (e) {
      throw new FavoritesCreateError();
    }
  }

  async createArtist(id: string): Promise<void> {
    try {
      await this.repository.createArtist(id);
    } catch (e) {
      throw new FavoritesCreateError();
    }
  }

  async removeTrack(id: string): Promise<void> {
    try {
      await this.repository.deleteTrack(id);
    } catch (e) {
      throw new FavoritesDeleteError();
    }
  }

  async removeAlbum(id: string): Promise<void> {
    try {
      await this.repository.deleteAlbum(id);
    } catch (e) {
      throw new FavoritesDeleteError();
    }
  }

  async removeArtist(id: string): Promise<void> {
    try {
      await this.repository.deleteArtist(id);
    } catch (e) {
      throw new FavoritesDeleteError();
    }
  }
}
