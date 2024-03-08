import { Module } from '@nestjs/common';
import { FavsController } from './favs.controller';
import { FavsService } from './favs.service';
import { db } from 'src/db';

@Module({
  controllers: [FavsController],
  providers: [
    FavsService,
    {
      provide: 'DB_CONNECTION',
      useValue: db,
    },
  ],
})
export class FavsModule {}
