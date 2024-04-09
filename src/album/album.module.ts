import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, PrismaService],
  imports: [AuthModule],
})
export class AlbumModule {}
