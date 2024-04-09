import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [UserService, PrismaService],
  controllers: [UserController],
  exports: [UserService],
  imports: [forwardRef(() => AuthModule)],
})
export class UserModule {}
