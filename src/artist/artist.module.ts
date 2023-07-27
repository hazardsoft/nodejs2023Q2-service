import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { TrackModule } from 'src/track/track.module';
import { AlbumModule } from 'src/album/album.module';

@Module({
  imports: [TrackModule, AlbumModule],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
