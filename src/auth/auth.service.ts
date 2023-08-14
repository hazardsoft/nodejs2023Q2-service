import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Auth } from './entity/auth.entity';
import { UserService } from 'src/user/user.service';
import { SignupDto } from './dto/signup.dto';
import { UnauthorizedError } from './errors';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly repository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto): Promise<void> {
    await this.userService.create({ ...dto });
  }

  async login(dto: LoginDto): Promise<Auth> {
    const user = await this.repository.findUserByLogin(dto.login);
    if (user.password !== dto.password) {
      throw new UnauthorizedError();
    }

    const payload = { userId: user.id, login: user.login };
    const jwtToken = await this.jwtService.signAsync(payload);

    return {
      accessToken: jwtToken,
    };
  }
}
