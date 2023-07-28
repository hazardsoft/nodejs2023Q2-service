import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from './entities/track.entity';
import { FavsService } from 'src/favs/favs.service';

@Controller('track')
export class TrackController {
  constructor(
    private readonly trackService: TrackService,
    private readonly favsService: FavsService,
  ) {}

  @Post()
  async create(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    return this.trackService.create(createTrackDto);
  }

  @Get()
  async findAll(): Promise<Track[]> {
    return this.trackService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Track> {
    return this.trackService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrackDto: CreateTrackDto,
  ): Promise<Track> {
    return this.trackService.update(id, updateTrackDto);
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const removedTrack = await this.trackService.remove(id);
    if (removedTrack) {
      try {
        await this.favsService.removeTrack(removedTrack.id);
      } catch (e) {}
    }
  }
}
