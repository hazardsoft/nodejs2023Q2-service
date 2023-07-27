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

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  @Post()
  async create(@Body() createTrackDto: CreateAlbumDto): Promise<Album> {
    return this.albumService.create(createTrackDto);
  }

  @Get()
  async findAll(): Promise<Album[]> {
    return this.albumService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Album> {
    return this.albumService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateArtistDto: CreateAlbumDto,
  ): Promise<Album> {
    return this.albumService.update(id, updateArtistDto);
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
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
    }
  }
}
