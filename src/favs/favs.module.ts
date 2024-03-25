import { Module } from '@nestjs/common';
import { FavsController } from './favs.controller';
import { FavsService } from './favs.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [FavsController],
  providers: [FavsService, PrismaService],
})
export class FavsModule {}
