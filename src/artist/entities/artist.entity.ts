import { ApiProperty } from '@nestjs/swagger';

export class Artist {
  @ApiProperty({ format: 'uuid v4' })
  id: string; // uuid v4

  @ApiProperty({ example: 'Freddie Mercury' })
  name: string;

  @ApiProperty({ example: false, default: false })
  grammy: boolean;
}
