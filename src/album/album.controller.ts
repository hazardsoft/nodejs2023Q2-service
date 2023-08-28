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
  HttpStatus,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album } from './entities/album.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { config } from 'src/config';
import {
  ApiCreateDecorators,
  ApiDeleteDecorators,
  ApiGetAllDecorators,
  ApiGetOneDecorators,
  ApiPutDecorators,
} from 'src/common/decorators';

@Controller('album')
@ApiTags('Album')
@ApiBearerAuth()
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @ApiCreateDecorators(Album.name)
  async create(@Body() createTrackDto: CreateAlbumDto): Promise<Album> {
    return this.albumService.create(createTrackDto);
  }

  @Get()
  @ApiGetAllDecorators(Album.name)
  async findAll(): Promise<Album[]> {
    return this.albumService.findAll();
  }

  @Get(':id')
  @ApiGetOneDecorators(Album.name)
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
  ): Promise<Album> {
    return this.albumService.findOne(id);
  }

  @Put(':id')
  @ApiPutDecorators(Album.name)
  async update(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
    @Body() updateArtistDto: CreateAlbumDto,
  ): Promise<Album> {
    return this.albumService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteDecorators(Album.name)
  async remove(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
  ): Promise<void> {
    await this.albumService.remove(id);
  }
}
