import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
  HttpCode,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album } from './entities/album.entity';
import { TrackService } from 'src/track/track.service';
import { CreateTrackDto } from 'src/track/dto/create-track.dto';
import { FavsService } from 'src/favs/favs.service';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiNoContentResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { config } from 'src/config';

@Controller('album')
@ApiTags('Album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
    private readonly favsService: FavsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Add new album',
    description: 'Add new album information',
  })
  @ApiCreatedResponse({
    description: 'Album is created',
    schema: { $ref: getSchemaPath(Album) },
  })
  @ApiBadRequestResponse({
    description: 'Bad request. body does not contain required fields',
  })
  async create(@Body() createTrackDto: CreateAlbumDto): Promise<Album> {
    return this.albumService.create(createTrackDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get albums list',
    description: 'Gets all library albums list',
  })
  async findAll(): Promise<Album[]> {
    return this.albumService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single album by id',
    description: 'Gets single album by id',
  })
  @ApiBadRequestResponse({
    description: 'Bad request. albumId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Album was not found',
  })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
  ): Promise<Album> {
    return this.albumService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update album information',
    description: 'Update library album information by UUID',
  })
  @ApiBadRequestResponse({
    description: 'Bad request. albumId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Album was not found',
  })
  async update(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
    @Body() updateArtistDto: CreateAlbumDto,
  ): Promise<Album> {
    return this.albumService.update(id, updateArtistDto);
  }

  @HttpCode(204)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete album',
    description: 'Delete album from library',
  })
  @ApiNoContentResponse({ description: 'Deleted successfully' })
  @ApiBadRequestResponse({
    description: 'Bad request. albumId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'Album was not found',
  })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
  ): Promise<void> {
    const removedAlbum = await this.albumService.remove(id);
    if (removedAlbum) {
      const tracks = await this.trackService.findAll();
      const tracksToUpdate = tracks.filter(
        (t) => t.albumId === removedAlbum.id,
      );
      tracksToUpdate.forEach((t) => {
        const trackUpdateDto = Object.assign({ ...t }, <
          Partial<CreateTrackDto>
        >{ albumId: null });
        this.trackService.update(t.id, trackUpdateDto);
      });

      try {
        await this.favsService.removeAlbum(removedAlbum.id);
      } catch (e) {}
    }
  }
}
