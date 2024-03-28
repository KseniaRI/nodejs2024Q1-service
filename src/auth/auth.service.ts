import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async generateTocken(login: string, id: string) {
    const payload = { login, id };
    return {
      tocken: this.jwtService.sign(payload),
    };
  }

  async signup(userDto: CreateUserDto) {
    const userWithLogin = await this.prisma.user.findUnique({
      where: {
        login: userDto.login,
      },
    });
    if (userWithLogin) {
      throw new ConflictException(
        `User with login ${userDto.login} already exists`,
      );
    }
    const salt = process.env.CRYPT_SALT;
    const hashPsw = await bcrypt.hash(userDto.password, Number(salt));
    const newUser = await this.userService.createUser({
      ...userDto,
      password: hashPsw,
    });
    return this.generateTocken(newUser.login, newUser.id);
  }

  //   async login(userDto: CreateUserDto) {}
}
