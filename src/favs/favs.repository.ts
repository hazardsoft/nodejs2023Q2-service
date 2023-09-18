import { Injectable } from '@nestjs/common';
import { FavoriteAlbum, FavoriteArtist, FavoriteTrack } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';
import { FavoritesIds } from './entities/fav.entity';
import { FavoritesCreateError, FavoritesDeleteError } from './errors';

@Injectable()
export default class FavoritesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getFavoritesIds(): Promise<FavoritesIds> {
    return this.prisma.findFavorites();
  }

  async createTrack(id: string): Promise<void> {
    try {
      await this.prisma.createFavoriteTrack(id);
    } catch (e) {
      throw new FavoritesCreateError();
    }
  }

  async createAlbum(id: string): Promise<void> {
    try {
      await this.prisma.createFavoriteAlbum(id);
    } catch (e) {
      throw new FavoritesCreateError();
    }
  }

  async createArtist(id: string): Promise<void> {
    try {
      await this.prisma.createFavoriteArtist(id);
    } catch (e) {
      throw new FavoritesCreateError();
    }
  }

  async deleteTrack(id: string): Promise<FavoriteTrack> {
    try {
      return this.prisma.removeFavoriteTrack(id);
    } catch (e) {
      throw new FavoritesDeleteError();
    }
  }
  async deleteAlbum(id: string): Promise<FavoriteAlbum> {
    try {
      return this.prisma.removeFavoriteAlbum(id);
    } catch (e) {
      throw new FavoritesDeleteError();
    }
  }
  async deleteArtist(id: string): Promise<FavoriteArtist> {
    try {
      return this.prisma.removeFavoriteArtist(id);
    } catch (e) {
      throw new FavoritesDeleteError();
    }
  }
}
