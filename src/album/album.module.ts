import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { FavsModule } from 'src/favs/favs.module';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [FavsModule, DbModule],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
