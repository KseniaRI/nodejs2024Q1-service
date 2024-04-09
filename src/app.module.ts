import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { FavsModule } from './favs/favs.module';
import { PrismaService } from './prisma/prisma.service';
import { LogsService } from './logs/logs.service';
import { LogsModule } from './logs/logs.module';
import { LoggerMiddleware } from './utils/logger.middleware';
import { CustomExceptionFilter } from './utils/custom-exception.filter';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    ArtistModule,
    AlbumModule,
    TrackModule,
    FavsModule,
    LogsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, LogsService, CustomExceptionFilter],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
