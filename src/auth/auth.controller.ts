import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  async signup(@Body() userDto: CreateUserDto) {
    return await this.authService.signup(userDto);
  }

  @Post('/login')
  async login(@Body() userDto: CreateUserDto) {
    return await this.authService.login(userDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refresh(@Body() refreshDto: RefreshDto) {
    return await this.authService.refresh(refreshDto);
  }
}
