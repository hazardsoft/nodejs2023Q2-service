import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { FavsModule } from 'src/favs/favs.module';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [FavsModule, DbModule],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
