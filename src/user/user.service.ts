import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4, validate } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private async getExistedUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async checkExistedUserLogin(login: string) {
    const userWithLogin = await this.prisma.user.findUnique({
      where: {
        login,
      },
    });
    return userWithLogin;
  }

  async getUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users;
  }

  async getUserById(id: string) {
    validate(id);
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User with id ${id} not found');
    }
    return user;
  }

  async createUser(userDto: CreateUserDto) {
    const now = Date.now();
    const currentTime = Math.floor(now / 1000);
    const newUser = await this.prisma.user.create({
      data: {
        ...userDto,
        id: uuidv4(),
        version: 1,
        createdAt: currentTime,
        updatedAt: currentTime,
      },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return newUser;
  }

  async deleteUser(id: string) {
    validate(id);
    const user = await this.getExistedUser(id);
    if (user) {
      await this.prisma.user.delete({
        where: {
          id,
        },
      });
    }
  }

  async updatePassword(updateUserDto: UpdateUserDto, id: string) {
    validate(id);
    const user = await this.getExistedUser(id);
    if (user) {
      if (updateUserDto.oldPassword !== user.password) {
        throw new ForbiddenException('Old password is wrong');
      }
      const now = Date.now();
      const updatedAt = Math.floor(now / 1000) + 1;
      const updatedUser = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          ...user,
          password: updateUserDto.newPassword,
          version: user.version + 1,
          updatedAt,
        },
        select: {
          id: true,
          login: true,
          version: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return updatedUser;
    }
  }
}
