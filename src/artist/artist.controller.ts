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
  HttpStatus,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Artist } from './entities/artist.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { config } from 'src/config';
import {
  ApiCreateDecorators,
  ApiDeleteDecorators,
  ApiGetAllDecorators,
  ApiGetOneDecorators,
  ApiPutDecorators,
} from 'src/common/decorators';

@Controller('artist')
@ApiTags('Artist')
@ApiBearerAuth()
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @ApiCreateDecorators(Artist.name)
  async create(@Body() createTrackDto: CreateArtistDto): Promise<Artist> {
    return this.artistService.create(createTrackDto);
  }

  @Get()
  @ApiGetAllDecorators(Artist.name)
  async findAll(): Promise<Artist[]> {
    return this.artistService.findAll();
  }

  @Get(':id')
  @ApiGetOneDecorators(Artist.name)
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
  ): Promise<Artist> {
    return this.artistService.findOne(id);
  }

  @Put(':id')
  @ApiPutDecorators(Artist.name)
  async update(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
    @Body() updateArtistDto: CreateArtistDto,
  ): Promise<Artist> {
    return this.artistService.update(id, updateArtistDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiDeleteDecorators(Artist.name)
  async remove(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
  ): Promise<void> {
    await this.artistService.remove(id);
  }
}
