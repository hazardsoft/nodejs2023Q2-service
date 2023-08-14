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

type SignupResponse = {
  message: string;
};

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
  async signup(@Body() dto: SignupDto): Promise<SignupResponse> {
    await this.authService.signup(dto);
    return {
      message: `signed up successfully, user ${dto.login}`,
    };
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
}
