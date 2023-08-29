import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
export class RefreshTokenDto {
  @ApiProperty({ name: 'refreshToken', type: String, required: true })
  @Allow()
  refreshToken: string;
}
