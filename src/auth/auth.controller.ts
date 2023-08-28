import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiTags,
  ApiOperation,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Auth } from './entity/auth.entity';
import { AuthService } from './auth.service';
import { SkipAuth } from './decorators';
import { User } from 'src/user/entities/user.entity';
import { RefreshTokenDto } from './dto/refresh.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @SkipAuth()
  @ApiOperation({ summary: 'Sign up', description: 'Signs up as a new user' })
  @ApiCreatedResponse({
    description: 'The user has been signed up',
  })
  @ApiBadRequestResponse({
    description: 'Bad request. body does not contain required fields',
  })
  async signup(@Body() dto: SignupDto): Promise<User> {
    return this.authService.signup(dto);
  }

  @Post('login')
  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login',
    description: 'Logins an user via login/password',
  })
  @ApiBadRequestResponse({
    description: 'Bad request. body does not contain required fields',
  })
  @ApiForbiddenResponse({
    description: 'Authentication failed',
  })
  async login(@Body() dto: LoginDto): Promise<Auth> {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh',
    description: 'Refreshes access/refresh tokens',
  })
  @ApiBadRequestResponse({
    description: 'Bad request. body does not contain required fields',
  })
  @ApiForbiddenResponse({
    description: 'Authentication failed',
  })
  async refresh(@Body() dto: RefreshTokenDto): Promise<Auth> {
    return this.authService.refresh(dto);
  }
}
