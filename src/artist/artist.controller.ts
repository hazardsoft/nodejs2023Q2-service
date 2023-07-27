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

@Controller('artist')
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
    private readonly trackService: TrackService,
  ) {}

  @Post()
  async create(@Body() createTrackDto: CreateArtistDto): Promise<Artist> {
    return this.artistService.create(createTrackDto);
  }

  @Get()
  async findAll(): Promise<Artist[]> {
    return this.artistService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Artist> {
    return this.artistService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateArtistDto: CreateArtistDto,
  ): Promise<Artist> {
    return this.artistService.update(id, updateArtistDto);
  }

  @HttpCode(204)
  @Delete(':id')
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
    }
  }
}
