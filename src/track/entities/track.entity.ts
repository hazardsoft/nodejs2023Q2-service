import { ApiProperty } from '@nestjs/swagger';

export class Track {
  @ApiProperty({ format: 'uuid v4' })
  id: string; // uuid v4

  @ApiProperty({ example: 'The Show Must Go On' })
  name: string;

  @ApiProperty({ format: 'uuid v4' })
  artistId: string | null; // refers to Artist

  @ApiProperty({ format: 'uuid v4' })
  albumId: string | null; // refers to Album

  @ApiProperty({
    description: 'In seconds',
    example: 262,
    type: 'integer',
    minimum: 1,
  })
  duration: number; // integer number
}
