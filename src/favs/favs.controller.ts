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
import { InvalidFavId } from './errors';
import { AlbumNotFoundError } from 'src/album/errors';
import { Favorites } from './entities/fav.entity';
import {
  ApiBadRequestResponse,
  ApiUnprocessableEntityResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { config } from 'src/config';
import { StatusCodes } from 'http-status-codes';

type FavCreateResponse = {
  message: string;
};
@Controller('favs')
@ApiTags('Favs')
export class FavsController {
  constructor(
    private readonly favsService: FavsService,
    private readonly trackService: TrackService,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all favorites',
    description: 'Gets all favorites movies, tracks and books',
  })
  async findAll(): Promise<Favorites> {
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
  @ApiOperation({
    summary: 'Add track to the favorites',
    description: 'Add track to the favorites',
  })
  @ApiCreatedResponse({ description: 'Added successfully' })
  @ApiBadRequestResponse({
    description: 'Bad. trackId is invalid (not uuid)',
  })
  @ApiUnprocessableEntityResponse({
    description: "Track with id doesn't exist",
  })
  async createTrackFav(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
  ): Promise<FavCreateResponse> {
    const track = await this.trackService.findOne(id);
    const isTrackCreated = await this.favsService.createTrack(track?.id);
    if (isTrackCreated) {
      return {
        message: `track fav (id ${id}) is created`,
      };
    }
  }

  @HttpCode(StatusCodes.NO_CONTENT)
  @Delete('/track/:id')
  @ApiOperation({
    summary: 'Delete track from favorites',
    description: 'Delete track from favorites',
  })
  @ApiNoContentResponse({
    description: 'Deleted successfully',
  })
  @ApiBadRequestResponse({
    description: 'Bad. trackId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Track was not found',
  })
  async removeTrackFav(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
  ): Promise<void> {
    await this.favsService.removeTrack(id);
  }

  @Post('/album/:id')
  @ApiOperation({
    summary: 'Add album to the favorites',
    description: 'Add album to the favorites',
  })
  @ApiCreatedResponse({ description: 'Added successfully' })
  @ApiBadRequestResponse({
    description: 'Bad. albumId is invalid (not uuid)',
  })
  @ApiUnprocessableEntityResponse({
    description: "Album with id doesn't exist",
  })
  async createAlbumFav(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
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

  @HttpCode(StatusCodes.NO_CONTENT)
  @Delete('/album/:id')
  @ApiOperation({
    summary: 'Delete album from favorites',
    description: 'Delete album from favorites',
  })
  @ApiNoContentResponse({
    description: 'Deleted successfully',
  })
  @ApiBadRequestResponse({
    description: 'Bad. albumId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Album was not found',
  })
  async removeAlbumFav(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
  ): Promise<void> {
    await this.favsService.removeAlbum(id);
  }

  @Post('/artist/:id')
  @ApiOperation({
    summary: 'Add artist to the favorites',
    description: 'Add artist to the favorites',
  })
  @ApiCreatedResponse({ description: 'Added successfully' })
  @ApiBadRequestResponse({
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiUnprocessableEntityResponse({
    description: "Artist with id doesn't exist",
  })
  async createArtistFav(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
  ): Promise<FavCreateResponse> {
    const artist = await this.artistService.findOne(id);
    const isArtistCreated = await this.favsService.createArtist(artist?.id);
    if (isArtistCreated) {
      return {
        message: `artist fav (id ${id}) is created`,
      };
    }
  }

  @HttpCode(StatusCodes.NO_CONTENT)
  @Delete('/artist/:id')
  @ApiOperation({
    summary: 'Delete artist from favorites',
    description: 'Delete artist from favorites',
  })
  @ApiNoContentResponse({
    description: 'Deleted successfully',
  })
  @ApiBadRequestResponse({
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Artist was not found',
  })
  async removeArtistFav(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
  ): Promise<void> {
    await this.favsService.removeArtist(id);
  }
}
