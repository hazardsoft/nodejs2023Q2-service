import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { FavsModule } from 'src/favs/favs.module';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [FavsModule, DbModule],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
