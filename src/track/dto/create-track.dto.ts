import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsOptional()
  artistId?: string | null; // refers to Artist
  @IsString()
  @IsOptional()
  albumId?: string | null; // refers to Album
  @IsNumber()
  @IsNotEmpty()
  duration: number; // integer number
}
