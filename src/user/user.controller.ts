import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  ParseUUIDPipe,
  UseInterceptors,
  UseFilters,
  ClassSerializerInterceptor,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { config } from 'src/config';
import { UserExceptionFilter } from './filters/user.exception.filter';
import {
  ApiCreateDecorators,
  ApiDeleteDecorators,
  ApiGetAllDecorators,
  ApiGetOneDecorators,
  ApiPutDecorators,
} from 'src/common/decorators';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(UserExceptionFilter)
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreateDecorators(User.name)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiGetAllDecorators(User.name)
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiGetOneDecorators(User.name)
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
  ): Promise<User> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @ApiPutDecorators(User.name)
  async update(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    return this.userService.updatePassword(id, updatePasswordDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiDeleteDecorators(User.name)
  async remove(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
  ): Promise<void> {
    await this.userService.remove(id);
  }
}
