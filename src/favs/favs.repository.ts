import { Injectable } from '@nestjs/common';
import { FavoriteAlbum, FavoriteArtist, FavoriteTrack } from '@prisma/client';
import { PrismaService } from 'src/db/prisma.service';
import { FavoritesIds } from './entities/fav.entity';

@Injectable()
export default class FavoritesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getFavoritesIds(): Promise<FavoritesIds> {
    return this.prisma.findFavorites();
  }

  async createTrack(id: string): Promise<void> {
    await this.prisma.createFavoriteTrack(id);
  }

  async createAlbum(id: string): Promise<void> {
    await this.prisma.createFavoriteAlbum(id);
  }

  async createArtist(id: string): Promise<void> {
    await this.prisma.createFavoriteArtist(id);
  }

  async deleteTrack(id: string): Promise<FavoriteTrack> {
    return this.prisma.removeFavoriteTrack(id);
  }
  async deleteAlbum(id: string): Promise<FavoriteAlbum> {
    return this.prisma.removeFavoriteAlbum(id);
  }
  async deleteArtist(id: string): Promise<FavoriteArtist> {
    return this.prisma.removeFavoriteArtist(id);
  }
}
