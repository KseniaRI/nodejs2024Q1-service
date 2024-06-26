import { Module } from '@nestjs/common';
import { FavsController } from './favs.controller';
import { FavsService } from './favs.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [FavsController],
  providers: [FavsService, PrismaService],
  imports: [AuthModule],
})
export class FavsModule {}
