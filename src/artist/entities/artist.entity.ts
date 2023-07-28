import { ApiProperty } from '@nestjs/swagger';

export class Artist {
  @ApiProperty({ format: 'uuid v4' })
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}
