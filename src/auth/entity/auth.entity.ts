import { ApiProperty } from '@nestjs/swagger';

export class Auth {
  @ApiProperty({ format: 'JWT' })
  accessToken: string;
}
