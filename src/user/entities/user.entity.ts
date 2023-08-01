import { Exclude, Transform } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ format: 'uuid v4' })
  id: string; // uuid v4

  login: string;

  @ApiHideProperty()
  @Exclude()
  password: string;

  @ApiProperty({ minimum: 1, example: 1 })
  version: number; // integer number, increments on update

  @ApiProperty({ example: 1655000000 })
  @Transform(({ value }) => {
    return value instanceof Date ? value.getTime() : value;
  })
  createdAt: number; // timestamp of creation

  @ApiProperty({ example: 1655000000 })
  @Transform(({ value }) => {
    return value instanceof Date ? value.getTime() : value;
  })
  updatedAt: number; // timestamp of last update
}
