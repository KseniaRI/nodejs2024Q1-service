import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() userDto: CreateUserDto) {
    return await this.authService.signup(userDto);
  }

  //   @Post('/login')
  //   async login(@Body() userDto: CreateUserDto) {
  //     return await this.authService.login(userDto);
  //   }
}
