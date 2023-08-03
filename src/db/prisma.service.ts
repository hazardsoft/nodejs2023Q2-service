import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  Album,
  Artist,
  Favorites,
  PrismaClient,
  Track,
  User,
} from '@prisma/client';
import { CreateAlbumDto } from 'src/album/dto/create-album.dto';
import { CreateArtistDto } from 'src/artist/dto/create-artist.dto';
import { CreateTrackDto } from 'src/track/dto/create-track.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdatePasswordDto } from 'src/user/dto/update-password.dto';

const favoritesEntityId = 1;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async findUser(id: string): Promise<User> {
    return await this.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async findTrack(id: string): Promise<Track> {
    return await this.track.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async findArtist(id: string): Promise<Artist> {
    return await this.artist.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async findAlbum(id: string): Promise<Album> {
    return await this.album.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async findUsers(): Promise<User[]> {
    return await this.user.findMany();
  }

  async findTracks(): Promise<Track[]> {
    return await this.track.findMany();
  }

  async findArtists(): Promise<Artist[]> {
    return await this.artist.findMany();
  }

  async findAlbums(): Promise<Album[]> {
    return await this.album.findMany();
  }

  async findFavorites(): Promise<Favorites> {
    return await this.favorites.findUniqueOrThrow({
      where: {
        id: favoritesEntityId,
      },
    });
  }

  async findSomeTracks(ids: string[]): Promise<Track[]> {
    return await this.track.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async findSomeArtists(ids: string[]): Promise<Artist[]> {
    return await this.artist.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async findSomeAlbums(ids: string[]): Promise<Album[]> {
    return await this.album.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async createUser(createDto: CreateUserDto): Promise<User> {
    return await this.user.create({
      data: createDto,
    });
  }

  async createTrack(createDto: CreateTrackDto): Promise<Track> {
    return await this.track.create({
      data: createDto,
    });
  }

  async createArtist(createDto: CreateArtistDto): Promise<Artist> {
    return await this.artist.create({
      data: createDto,
    });
  }

  async createAlbum(createDto: CreateAlbumDto): Promise<Album> {
    return await this.album.create({
      data: createDto,
    });
  }

  async createFavoriteTrack(id: string): Promise<Favorites> {
    return await this.favorites.update({
      where: {
        id: favoritesEntityId,
      },
      data: {
        tracks: {
          push: id,
        },
      },
    });
  }

  async createFavoriteAlbum(id: string): Promise<Favorites> {
    return await this.favorites.update({
      where: {
        id: favoritesEntityId,
      },
      data: {
        albums: {
          push: id,
        },
      },
    });
  }

  async createFavoriteArtist(id: string): Promise<Favorites> {
    return await this.favorites.update({
      where: {
        id: favoritesEntityId,
      },
      data: {
        artists: {
          push: id,
        },
      },
    });
  }

  async updateUserPassword(
    id: string,
    updateDto: UpdatePasswordDto,
  ): Promise<User | undefined> {
    return await this.user.update({
      where: {
        id,
      },
      data: {
        version: {
          increment: 1,
        },
        updatedAt: new Date(),
        password: updateDto.newPassword,
      },
    });
  }

  async updateTrack(id: string, updateDto: CreateTrackDto): Promise<Track> {
    return await this.track.update({
      where: {
        id,
      },
      data: updateDto,
    });
  }

  async updateArtist(id: string, updateDto: CreateArtistDto): Promise<Artist> {
    return await this.artist.update({
      where: {
        id,
      },
      data: updateDto,
    });
  }

  async updateAlbum(id: string, updateDto: CreateAlbumDto): Promise<Album> {
    return await this.album.update({
      where: {
        id,
      },
      data: updateDto,
    });
  }

  async removeUser(id: string): Promise<User> {
    return await this.user.delete({
      where: {
        id,
      },
    });
  }

  async removeTrack(id: string): Promise<Track> {
    return await this.track.delete({
      where: {
        id,
      },
    });
  }

  async removeArtist(id: string): Promise<Artist> {
    return await this.artist.delete({
      where: {
        id,
      },
    });
  }

  async removeAlbum(id: string): Promise<Album> {
    return await this.album.delete({
      where: {
        id,
      },
    });
  }

  async removeFavoriteTrack(id: string): Promise<Favorites> {
    const favorites = await this.findFavorites();
    const tracksIds = favorites.tracks;

    return await this.favorites.update({
      where: {
        id: favoritesEntityId,
      },
      data: {
        tracks: {
          set: tracksIds.filter((t) => t !== id),
        },
      },
    });
  }

  async removeFavoriteAlbum(id: string): Promise<Favorites> {
    const favorites = await this.findFavorites();
    const albumIds = favorites.albums;

    return await this.favorites.update({
      where: {
        id: favoritesEntityId,
      },
      data: {
        albums: {
          set: albumIds.filter((a) => a !== id),
        },
      },
    });
  }

  async removeFavoriteArtist(id: string): Promise<Favorites> {
    const favorites = await this.findFavorites();
    const artistIds = favorites.artists;

    return await this.favorites.update({
      where: {
        id: favoritesEntityId,
      },
      data: {
        artists: {
          set: artistIds.filter((a) => a !== id),
        },
      },
    });
  }
}
