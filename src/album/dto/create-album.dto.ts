import {
  IsNotEmpty,
  IsString,
  ValidateIf,
  IsUUID,
  IsInt,
} from 'class-validator';
import { config } from 'src/config';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  year: number;

  @ValidateIf((obj) => obj.artistId !== null)
  @IsString({ message: 'artistId must be a string or null' })
  @IsUUID(config.uuid.version)
  artistId: string | null; // refers to Artist
}
