import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, PrismaService],
  imports: [AuthModule],
})
export class ArtistModule {}
