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
  HttpStatus,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
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
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'required body fields are not supplied',
  })
  async create(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    return this.trackService.create(createTrackDto);
  }

  @Get()
  async findAll(): Promise<Track[]> {
    return this.trackService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'supplied id is not UUID',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'track id is not found',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Track> {
    return this.trackService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'supplied id is not UUID',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'track id is not found',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrackDto: CreateTrackDto,
  ): Promise<Track> {
    return this.trackService.update(id, updateTrackDto);
  }

  @HttpCode(204)
  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'track successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'supplied id is not UUID',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'track id is not found',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const removedTrack = await this.trackService.remove(id);
    if (removedTrack) {
      try {
        await this.favsService.removeTrack(removedTrack.id);
      } catch (e) {}
    }
  }
}
