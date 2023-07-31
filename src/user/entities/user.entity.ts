import { Exclude, Transform } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ format: 'uuid v4' })
  id: string; // uuid v4
  login: string;
  @ApiHideProperty()
  @Exclude()
  password: string;
  version: number; // integer number, increments on update
  @Transform(({ value }) => {
    return value instanceof Date ? value.getTime() : value;
  })
  createdAt: Date; // timestamp of creation
  @Transform(({ value }) => {
    return value instanceof Date ? value.getTime() : value;
  })
  updatedAt: Date; // timestamp of last update
}
