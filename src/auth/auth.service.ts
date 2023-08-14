import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Auth } from './entity/auth.entity';
import { UserService } from 'src/user/user.service';
import { SignupDto } from './dto/signup.dto';
import { UnauthorizedError } from './errors';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto): Promise<User> {
    return this.userService.create({ ...dto });
  }

  async login(dto: LoginDto): Promise<Auth> {
    const isPasswordMatch = await this.userService.isPasswordMatch(
      dto.login,
      dto.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedError();
    }
    const user = await this.userService.findOneByLogin(dto.login);
    const payload = { userId: user.id, login: user.login };
    const jwtToken = await this.jwtService.signAsync(payload);

    return {
      accessToken: jwtToken,
    };
  }
}
