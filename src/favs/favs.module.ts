import { Module } from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';
import { PrismaModule } from 'src/db/prisma.module';
import FavoritesRepository from './favs.repository';
import { TrackModule } from 'src/track/track.module';
import { AlbumModule } from 'src/album/album.module';
import { ArtistModule } from 'src/artist/artist.module';

@Module({
  imports: [PrismaModule, TrackModule, AlbumModule, ArtistModule],
  controllers: [FavsController],
  providers: [FavsService, FavoritesRepository],
  exports: [FavsService],
})
export class FavsModule {}
