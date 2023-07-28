import { ApiProperty } from '@nestjs/swagger';

export class Album {
  @ApiProperty({ format: 'uuid v4' })
  id: string; // uuid v4
  name: string;
  year: number;
  artistId?: string | null; // refers to Artist
}
