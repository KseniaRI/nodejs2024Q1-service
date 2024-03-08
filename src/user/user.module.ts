import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { db } from 'src/db';

@Module({
  providers: [
    UserService,
    {
      provide: 'DB_CONNECTION',
      useValue: db,
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
