import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from 'class-validator';
import { config } from 'src/config';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateIf((obj) => obj.artistId !== null)
  @IsString({ message: 'artistId must be a string or null' })
  @IsUUID(config.uuid.version)
  artistId: string | null; // refers to Artist

  @ValidateIf((obj) => obj.albumId !== null)
  @IsString({ message: 'albumId must be a string or null' })
  @IsUUID(config.uuid.version)
  albumId: string | null; // refers to Album

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  duration: number; // integer number
}
