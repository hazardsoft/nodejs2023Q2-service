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
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { config } from 'src/config';
import { StatusCodes } from 'http-status-codes';
import { UserExceptionFilter } from './filters/user.exception.filter';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(UserExceptionFilter)
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create user', description: 'Creates a new user' })
  @ApiCreatedResponse({
    description: 'The user has been created',
    schema: { $ref: getSchemaPath(User) },
  })
  @ApiBadRequestResponse({
    description: 'Bad request. body does not contain required fields',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users', description: 'Gets all users' })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single user by id',
    description: 'Get single user by id',
  })
  @ApiBadRequestResponse({
    description: 'Bad request. userId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
  ): Promise<User> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: "Update a user's password",
    description: "Updates a user's password by ID",
  })
  @ApiBadRequestResponse({
    description: 'Bad request. userId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiForbiddenResponse({
    description: 'oldPassword is wrong',
  })
  async update(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    return this.userService.updatePassword(id, updatePasswordDto);
  }

  @HttpCode(StatusCodes.NO_CONTENT)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user',
    description: 'Deletes user by ID',
  })
  @ApiNoContentResponse({
    description: 'The user has been deleted',
  })
  @ApiBadRequestResponse({
    description: 'Bad request. userId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: config.uuid.version }))
    id: string,
  ): Promise<void> {
    await this.userService.remove(id);
  }
}
