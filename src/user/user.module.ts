import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { db } from 'src/db';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [
    UserService,
    PrismaService,
    {
      provide: 'DB_CONNECTION',
      useValue: db,
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
