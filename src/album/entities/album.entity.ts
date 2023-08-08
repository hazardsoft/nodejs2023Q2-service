import { ApiProperty } from '@nestjs/swagger';

export class Album {
  @ApiProperty({ format: 'uuid v4' })
  id: string; // uuid v4

  @ApiProperty({ example: 'Innuendo' })
  name: string;

  @ApiProperty({ example: 1991, type: 'integer' })
  year: number;

  @ApiProperty({ format: 'uuid v4' })
  artistId: string | null; // refers to Artist
}
