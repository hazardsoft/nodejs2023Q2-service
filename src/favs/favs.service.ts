import { Injectable } from '@nestjs/common';
import { Favorites } from './entities/fav.entity';
import { plainToInstance } from 'class-transformer';
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
    await this.repository.createTrack(id);
  }

  async createAlbum(id: string): Promise<void> {
    await this.repository.createAlbum(id);
  }

  async createArtist(id: string): Promise<void> {
    await this.repository.createArtist(id);
  }

  async removeTrack(id: string): Promise<void> {
    await this.repository.deleteTrack(id);
  }

  async removeAlbum(id: string): Promise<void> {
    await this.repository.deleteAlbum(id);
  }

  async removeArtist(id: string): Promise<void> {
    await this.repository.deleteArtist(id);
  }
}
