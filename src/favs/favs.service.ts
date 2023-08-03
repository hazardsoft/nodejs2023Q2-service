import { Injectable } from '@nestjs/common';
import { Favorites, FavoritesIds } from './entities/fav.entity';
import { PrismaService } from 'src/db/prisma.service';
import { plainToInstance } from 'class-transformer';
import { FavoritesCreateError, FavoritesDeleteError } from './errors';

@Injectable()
export class FavsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<Favorites> {
    const favoritesIds = await this.prismaService.findFavorites();
    const tracks = await this.prismaService.findSomeTracks(favoritesIds.tracks);
    const artists = await this.prismaService.findSomeArtists(
      favoritesIds.artists,
    );
    const albums = await this.prismaService.findSomeAlbums(favoritesIds.albums);

    return plainToInstance(Favorites, {
      tracks,
      artists,
      albums,
    });
  }

  async createTrack(id: string): Promise<FavoritesIds> {
    try {
      await this.prismaService.findTrack(id);
    } catch (e) {
      throw new FavoritesCreateError();
    }

    return plainToInstance(
      FavoritesIds,
      await this.prismaService.createFavoriteTrack(id),
    );
  }

  async createAlbum(id: string): Promise<FavoritesIds> {
    try {
      await this.prismaService.findAlbum(id);
    } catch (e) {
      throw new FavoritesCreateError();
    }

    return plainToInstance(
      FavoritesIds,
      await this.prismaService.createFavoriteAlbum(id),
    );
  }

  async createArtist(id: string): Promise<FavoritesIds> {
    try {
      await this.prismaService.findArtist(id);
    } catch (e) {
      throw new FavoritesCreateError();
    }

    return plainToInstance(
      FavoritesIds,
      await this.prismaService.createFavoriteArtist(id),
    );
  }

  async removeTrack(id: string): Promise<FavoritesIds> {
    const favorites = await this.prismaService.findFavorites();
    if (!favorites.tracks.includes(id)) {
      throw new FavoritesDeleteError();
    }

    return plainToInstance(
      FavoritesIds,
      await this.prismaService.removeFavoriteTrack(id),
    );
  }

  async removeAlbum(id: string): Promise<FavoritesIds> {
    const favorites = await this.prismaService.findFavorites();
    if (!favorites.albums.includes(id)) {
      throw new FavoritesDeleteError();
    }

    return plainToInstance(
      FavoritesIds,
      await this.prismaService.removeFavoriteAlbum(id),
    );
  }

  async removeArtist(id: string): Promise<FavoritesIds> {
    const favorites = await this.prismaService.findFavorites();
    if (!favorites.artists.includes(id)) {
      throw new FavoritesDeleteError();
    }

    return plainToInstance(
      FavoritesIds,
      await this.prismaService.removeFavoriteArtist(id),
    );
  }
}
