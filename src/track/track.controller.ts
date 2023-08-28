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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from './entities/track.entity';
import { config } from 'src/config';
import {
  ApiCreateDecorators,
  ApiDeleteDecorators,
  ApiGetAllDecorators,
  ApiGetOneDecorators,
  ApiPutDecorators,
} from 'src/common/decorators';

@Controller('track')
@ApiTags('Track')
@ApiBearerAuth()
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @ApiCreateDecorators(Track.name)
  async create(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    return this.trackService.create(createTrackDto);
  }

  @Get()
  @ApiGetAllDecorators(Track.name)
  async findAll(): Promise<Track[]> {
    return this.trackService.findAll();
  }

  @Get(':id')
  @ApiGetOneDecorators(Track.name)
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
  ): Promise<Track> {
    return this.trackService.findOne(id);
  }

  @Put(':id')
  @ApiPutDecorators(Track.name)
  async update(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
    @Body() updateTrackDto: CreateTrackDto,
  ): Promise<Track> {
    return this.trackService.update(id, updateTrackDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiDeleteDecorators(Track.name)
  async remove(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
  ): Promise<void> {
    await this.trackService.remove(id);
  }
}
