import { Exclude } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ format: 'uuid v4' })
  id: string; // uuid v4
  login: string;
  @ApiHideProperty()
  @Exclude()
  password: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}
