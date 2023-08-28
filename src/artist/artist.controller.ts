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
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  getSchemaPath,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { config } from 'src/config';
import { StatusCodes } from 'http-status-codes';

@Controller('artist')
@ApiTags('Artist')
@ApiBearerAuth()
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

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
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
  ): Promise<Artist> {
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
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
    @Body() updateArtistDto: CreateArtistDto,
  ): Promise<Artist> {
    return this.artistService.update(id, updateArtistDto);
  }

  @HttpCode(StatusCodes.NO_CONTENT)
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
  async remove(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
  ): Promise<void> {
    await this.artistService.remove(id);
  }
}
