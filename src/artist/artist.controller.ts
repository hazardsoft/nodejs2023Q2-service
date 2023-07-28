import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  Put,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Artist } from './entities/artist.entity';
import { TrackService } from 'src/track/track.service';
import { CreateTrackDto } from 'src/track/dto/create-track.dto';
import { AlbumService } from 'src/album/album.service';
import { CreateAlbumDto } from 'src/album/dto/create-album.dto';
import { FavsService } from 'src/favs/favs.service';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  getSchemaPath,
} from '@nestjs/swagger';

@Controller('artist')
@ApiTags('Artist')
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly favsService: FavsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Add new artist', description: 'Add new artist' })
  @ApiCreatedResponse({
    description: 'Successful operation',
    schema: { $ref: getSchemaPath(Artist) },
  })
  @ApiBadRequestResponse({
    description: 'Bad request. body does not contain required fields',
  })
  async create(@Body() createTrackDto: CreateArtistDto): Promise<Artist> {
    return this.artistService.create(createTrackDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all artists', description: 'Gets all artists' })
  async findAll(): Promise<Artist[]> {
    return this.artistService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single artist by id',
    description: 'Get single artist by id',
  })
  @ApiBadRequestResponse({
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Artist was not found',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Artist> {
    return this.artistService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update artist information',
    description: 'Update artist information by UUID',
  })
  @ApiBadRequestResponse({
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Artist was not found',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateArtistDto: CreateArtistDto,
  ): Promise<Artist> {
    return this.artistService.update(id, updateArtistDto);
  }

  @HttpCode(204)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete artist',
    description: 'Delete artist from library',
  })
  @ApiBadRequestResponse({
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Artist was not found',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const removedArtist = await this.artistService.remove(id);
    if (removedArtist) {
      const tracks = await this.trackService.findAll();
      const tracksToUpdate = tracks.filter(
        (t) => t.artistId === removedArtist.id,
      );
      tracksToUpdate.forEach((t) => {
        const trackUpdateDto = Object.assign({ ...t }, <
          Partial<CreateTrackDto>
        >{ artistId: null });
        this.trackService.update(t.id, trackUpdateDto);
      });

      const albums = await this.albumService.findAll();
      const albumsToUpdate = albums.filter(
        (a) => a.artistId === removedArtist.id,
      );
      albumsToUpdate.forEach((a) => {
        const albumUpdateDto = Object.assign({ ...a }, <
          Partial<CreateAlbumDto>
        >{ artistId: null });
        this.albumService.update(a.id, albumUpdateDto);
      });

      try {
        await this.favsService.removeArtist(removedArtist.id);
      } catch (e) {}
    }
  }
}
