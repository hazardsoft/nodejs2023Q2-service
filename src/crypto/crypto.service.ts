import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CryptoService {
  private saltReounds: number;

  constructor(private readonly configService: ConfigService) {
    this.saltReounds = Number(this.configService.get<number>('CRYPT_SALT'));
  }

  async isPasswordMatch(password: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltReounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
}
