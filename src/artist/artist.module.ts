import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { db } from 'src/db';

@Module({
  controllers: [ArtistController],
  providers: [
    ArtistService,
    {
      provide: 'DB_CONNECTION',
      useValue: db,
    },
  ],
})
export class ArtistModule {}
