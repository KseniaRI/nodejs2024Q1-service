/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { validateIdFormat } from 'src/heplers';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    // @Inject('DB_CONNECTION') private readonly db: DB,
    private prisma: PrismaService,
  ) {}
  // constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    // return this.db.users.map((user) => {
    //   const { password, ...userWithoutPassword } = user;
    //   return userWithoutPassword;
    // });
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
      throw new NotFoundException('User not found');
    }
    return user;
    // validateIdFormat(id);
    // const user = getEntityById(id, this.db.users);
    // if (user) {
    //   const { password, ...userWithoutPassword } = user;
    //   return userWithoutPassword;
    // }
  }

  async createUser(userDto: CreateUserDto) {
    if (
      !userDto.login ||
      !userDto.password ||
      typeof userDto.login !== 'string' ||
      typeof userDto.password !== 'string'
    ) {
      throw new BadRequestException(
        'Request body does not contain required fields or their format is not correct',
      );
    }
    const currentTime = Date();
    const newUser = await this.prisma.user.create({
      data: {
        ...userDto,
        id: uuidv4(),
        version: 1,
        createdAt: currentTime,
        updatedAt: currentTime,
      },
    });
    // const newUser = {
    //   ...userDto,
    //   id: uuidv4(),
    //   version: 1,
    //   createdAt: Date.now(),
    //   updatedAt: Date.now(),
    // };
    // this.db.users.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async deleteUser(id: string) {
    // deleteEntityFromCollection(id, this.db.users);
    const deletedUser = await this.prisma.user.delete({
      where: {
        id,
      },
    });
    if (!deletedUser) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
  }

  async updatePassword(updateUserDto: UpdateUserDto, id: string) {
    if (
      !updateUserDto.oldPassword ||
      !updateUserDto.newPassword ||
      typeof updateUserDto.oldPassword !== 'string' ||
      typeof updateUserDto.newPassword !== 'string'
    ) {
      throw new BadRequestException(
        'Request body does not contain required fields or their format is not correct',
      );
    }
    validateIdFormat(id);
    // const user: IUser = this.db.users.find((user) => user.id === id);
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (user) {
      if (updateUserDto.oldPassword !== user.password) {
        throw new ForbiddenException('Old password is wrong');
      }
      const currentTime = Date();
      const updatedUser = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          ...user,
          password: updateUserDto.newPassword,
          version: user.version + 1,
          updatedAt: currentTime,
        },
      });
      // const updatedUser = {
      //   ...user,
      //   password: updateUserDto.newPassword,
      //   version: user.version + 1,
      //   updatedAt: Date.now(),
      // };
      // const userIdx = this.db.users.indexOf(user);
      // this.db.users[userIdx] = updatedUser;
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } else {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
