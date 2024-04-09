import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private async generateToken(login: string, id: string) {
    const payload = { login, userId: id };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload),
    };
  }
  private async validateUser(login: string, password: string) {
    const user = await this.userService.checkExistedUserLogin(login);
    const samePasswords = await bcrypt.compare(password, user.password);
    if (user && samePasswords) {
      return user;
    }
    throw new ForbiddenException('Incorrect login or password');
  }
  private async validateDto(userDto: CreateUserDto) {
    const dtoNonValid =
      !userDto.login ||
      !userDto.password ||
      typeof userDto.password !== 'string' ||
      typeof userDto.login !== 'string';

    if (dtoNonValid) {
      throw new BadRequestException(
        'Login o password are missed or their types are incorrect',
      );
    }
  }

  async signup(userDto: CreateUserDto) {
    await this.validateDto(userDto);
    const salt = process.env.CRYPT_SALT;
    const hashPsw = await bcrypt.hash(userDto.password, Number(salt));
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPsw,
    });
    return { id: user.id };
  }

  async login(userDto: CreateUserDto) {
    await this.validateDto(userDto);
    const user = await this.validateUser(userDto.login, userDto.password);
    return await this.generateToken(user.login, user.id);
  }

  async refresh(refreshDto: RefreshDto) {
    if (!refreshDto.refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    let payload: any;

    try {
      payload = this.jwtService.verify(refreshDto.refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
      console.log('payload', payload);
    } catch (error) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const user = await this.userService.getUserById(payload.userId);

    const accessToken = this.jwtService.sign({
      login: user.login,
      userId: user.id,
    });
    const newRefreshToken = this.jwtService.sign(
      { userId: user.id, login: user.login },
      { expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME },
    );
    return { accessToken, refreshToken: newRefreshToken };
  }
}
