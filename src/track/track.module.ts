import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TrackController],
  providers: [TrackService, PrismaService],
  imports: [AuthModule],
})
export class TrackModule {}
