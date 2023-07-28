import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { FavsService } from './favs.service';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';
import { Album } from 'src/album/entities/album.entity';
import { TrackNotFoundError } from 'src/track/errors';
import { InvalidFavId } from './errors';
import { AlbumNotFoundError } from 'src/album/errors';
import { ArtistNotFoundError } from 'src/artist/errors';

type FavsResponse = {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
};

type FavCreateResponse = {
  message: string;
};
@Controller('favs')
export class FavsController {
  constructor(
    private readonly favsService: FavsService,
    private readonly trackService: TrackService,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
  ) {}

  @Get()
  async findAll(): Promise<FavsResponse> {
    const favs = await this.favsService.findAll();
    const artists = await this.artistService.findAll();
    const albums = await this.albumService.findAll();
    const tracks = await this.trackService.findAll();
    return {
      artists: artists.filter((a) => favs.artists.includes(a.id)),
      albums: albums.filter((a) => favs.albums.includes(a.id)),
      tracks: tracks.filter((t) => favs.tracks.includes(t.id)),
    };
  }

  @Post('/track/:id')
  async createTrackFav(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FavCreateResponse> {
    try {
      const track = await this.trackService.findOne(id);
      const isTrackCreated = await this.favsService.createTrack(track?.id);
      if (isTrackCreated) {
        return {
          message: `track fav (id ${id}) is created`,
        };
      }
    } catch (e) {
      if (e instanceof TrackNotFoundError) {
        throw new InvalidFavId(id, 'track');
      }
    }
  }

  @HttpCode(204)
  @Delete('/track/:id')
  async removeTrackFav(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.favsService.removeTrack(id);
  }

  @Post('/album/:id')
  async createAlbumFav(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FavCreateResponse> {
    try {
      const album = await this.albumService.findOne(id);
      const isAlbumCreated = await this.favsService.createAlbum(album?.id);
      if (isAlbumCreated) {
        return {
          message: `album fav (id ${id}) is created`,
        };
      }
    } catch (e) {
      if (e instanceof AlbumNotFoundError) {
        throw new InvalidFavId(id, 'album');
      }
    }
  }

  @HttpCode(204)
  @Delete('/album/:id')
  async removeAlbumFav(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.favsService.removeAlbum(id);
  }

  @Post('/artist/:id')
  async createArtistFav(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FavCreateResponse> {
    try {
      const artist = await this.artistService.findOne(id);
      const isArtistCreated = await this.favsService.createArtist(artist?.id);
      if (isArtistCreated) {
        return {
          message: `artist fav (id ${id}) is created`,
        };
      }
    } catch (e) {
      if (e instanceof ArtistNotFoundError) {
        throw new InvalidFavId(id, 'album');
      }
    }
  }

  @HttpCode(204)
  @Delete('/artist/:id')
  async removeArtistFav(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.favsService.removeArtist(id);
  }
}
