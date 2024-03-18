import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { formatDate } from 'src/heplers';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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
    const newUser = await this.prisma.user.create({
      data: {
        ...userDto,
        id: uuidv4(),
        version: 1,
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
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async updatePassword(updateUserDto: UpdateUserDto, id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (user) {
      if (updateUserDto.oldPassword !== user.password) {
        throw new ForbiddenException('Old password is wrong');
      }
      const currentTime = new Date();
      const formattedDate = formatDate(currentTime);
      const updatedUser = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          ...user,
          password: updateUserDto.newPassword,
          version: user.version + 1,
          updatedAt: formattedDate,
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
    } else {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
