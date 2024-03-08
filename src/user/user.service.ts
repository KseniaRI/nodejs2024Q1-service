/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DB } from 'src/db';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from 'src/types/interfaces';
import {
  deleteEntityFromCollection,
  getEntityById,
  validateIdFormat,
} from 'src/heplers';

@Injectable()
export class UserService {
  constructor(@Inject('DB_CONNECTION') private readonly db: DB) {}

  async getUsers() {
    return this.db.users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async getUserById(id: string) {
    validateIdFormat(id);
    const user = getEntityById(id, this.db.users);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
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
    const newUser = {
      ...userDto,
      id: uuidv4(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.db.users.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async deleteUser(id: string) {
    deleteEntityFromCollection(id, this.db.users);
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
    const user: IUser = this.db.users.find((user) => user.id === id);

    if (user) {
      if (updateUserDto.oldPassword !== user.password) {
        throw new ForbiddenException('Old password is wrong');
      }
      const updatedUser = {
        ...user,
        password: updateUserDto.newPassword,
        version: user.version + 1,
        updatedAt: Date.now(),
      };
      const userIdx = this.db.users.indexOf(user);
      this.db.users[userIdx] = updatedUser;
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } else {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
