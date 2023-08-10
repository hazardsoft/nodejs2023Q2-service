import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  Album,
  Artist,
  FavoriteAlbum,
  FavoriteArtist,
  FavoriteTrack,
  PrismaClient,
  Track,
  User,
} from '@prisma/client';
import { CreateAlbumDto } from 'src/album/dto/create-album.dto';
import { CreateArtistDto } from 'src/artist/dto/create-artist.dto';
import { FavoritesIds } from 'src/favs/entities/fav.entity';
import { CreateTrackDto } from 'src/track/dto/create-track.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdatePasswordDto } from 'src/user/dto/update-password.dto';

const favoritesEntityId = 1;

@Injectable()
export class PrismaService implements OnModuleInit {
  private readonly prisma = new PrismaClient();

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async findUser(id: string): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async findTrack(id: string): Promise<Track> {
    return await this.prisma.track.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async findArtist(id: string): Promise<Artist> {
    return await this.prisma.artist.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async findAlbum(id: string): Promise<Album> {
    return await this.prisma.album.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async findUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findTracks(): Promise<Track[]> {
    return await this.prisma.track.findMany();
  }

  async findArtists(): Promise<Artist[]> {
    return await this.prisma.artist.findMany();
  }

  async findAlbums(): Promise<Album[]> {
    return await this.prisma.album.findMany();
  }

  async findFavorites(): Promise<FavoritesIds> {
    const favorites = await this.prisma.favorite.findUniqueOrThrow({
      where: {
        id: favoritesEntityId,
      },
      include: {
        tracks: true,
        albums: true,
        artists: true,
      },
    });
    return {
      tracks: favorites.tracks.map((t) => t.trackId),
      artists: favorites.artists.map((a) => a.artistId),
      albums: favorites.albums.map((a) => a.albumId),
    };
  }

  async findSomeUsers(ids: string[]): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async findSomeTracks(ids: string[]): Promise<Track[]> {
    return await this.prisma.track.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async findSomeArtists(ids: string[]): Promise<Artist[]> {
    return await this.prisma.artist.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async findSomeAlbums(ids: string[]): Promise<Album[]> {
    return await this.prisma.album.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async createUser(createDto: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: createDto,
    });
  }

  async createTrack(createDto: CreateTrackDto): Promise<Track> {
    return await this.prisma.track.create({
      data: createDto,
    });
  }

  async createArtist(createDto: CreateArtistDto): Promise<Artist> {
    return await this.prisma.artist.create({
      data: createDto,
    });
  }

  async createAlbum(createDto: CreateAlbumDto): Promise<Album> {
    return await this.prisma.album.create({
      data: createDto,
    });
  }

  async createFavoriteTrack(trackId: string): Promise<string> {
    try {
      await this.prisma.favorite.update({
        where: {
          id: favoritesEntityId,
        },
        data: {
          tracks: {
            create: {
              trackId,
            },
          },
        },
      });
      return trackId;
    } catch (e) {
      throw e;
    }
  }

  async createFavoriteAlbum(albumId: string): Promise<string> {
    try {
      await this.prisma.favorite.update({
        where: {
          id: favoritesEntityId,
        },
        data: {
          albums: {
            create: {
              albumId,
            },
          },
        },
      });
      return albumId;
    } catch (e) {
      throw e;
    }
  }

  async createFavoriteArtist(artistId: string): Promise<string> {
    try {
      await this.prisma.favorite.update({
        where: {
          id: favoritesEntityId,
        },
        data: {
          artists: {
            create: {
              artistId,
            },
          },
        },
      });
      return artistId;
    } catch (e) {
      throw e;
    }
  }

  async updateUserPassword(
    id: string,
    updateDto: UpdatePasswordDto,
  ): Promise<User | undefined> {
    return await this.prisma.user.update({
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
    return await this.prisma.track.update({
      where: {
        id,
      },
      data: updateDto,
    });
  }

  async updateArtist(id: string, updateDto: CreateArtistDto): Promise<Artist> {
    return await this.prisma.artist.update({
      where: {
        id,
      },
      data: updateDto,
    });
  }

  async updateAlbum(id: string, updateDto: CreateAlbumDto): Promise<Album> {
    return await this.prisma.album.update({
      where: {
        id,
      },
      data: updateDto,
    });
  }

  async removeUser(id: string): Promise<User> {
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async removeTrack(id: string): Promise<Track> {
    return await this.prisma.track.delete({
      where: {
        id,
      },
    });
  }

  async removeArtist(id: string): Promise<Artist> {
    return await this.prisma.artist.delete({
      where: {
        id,
      },
    });
  }

  async removeAlbum(id: string): Promise<Album> {
    return await this.prisma.album.delete({
      where: {
        id,
      },
    });
  }

  async removeFavoriteTrack(trackId: string): Promise<FavoriteTrack> {
    return await this.prisma.favoriteTrack.delete({
      where: {
        trackId_favoriteId: {
          trackId,
          favoriteId: favoritesEntityId,
        },
      },
    });
  }

  async removeFavoriteAlbum(albumId: string): Promise<FavoriteAlbum> {
    return await this.prisma.favoriteAlbum.delete({
      where: {
        albumId_favoriteId: {
          albumId,
          favoriteId: favoritesEntityId,
        },
      },
    });
  }

  async removeFavoriteArtist(artistId: string): Promise<FavoriteArtist> {
    return await this.prisma.favoriteArtist.delete({
      where: {
        artistId_favoriteId: {
          artistId,
          favoriteId: favoritesEntityId,
        },
      },
    });
  }
}
