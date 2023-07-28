import { ApiProperty } from '@nestjs/swagger';

export class Track {
  @ApiProperty({ format: 'uuid v4' })
  id: string; // uuid v4
  name: string;
  @ApiProperty({ format: 'uuid v4' })
  artistId?: string | null; // refers to Artist
  @ApiProperty({ format: 'uuid v4' })
  albumId?: string | null; // refers to Album
  duration: number; // integer number
}
