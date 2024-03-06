import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { validateIdFormat } from 'src/heplers/validateIdFormat';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from 'src/types/interfaces';

@Injectable()
export class UserService {
  private users = [];

  async getUsers() {
    return this.users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async getUserById(id: string) {
    validateIdFormat(id);

    const user = this.users.find((user) => user.id === id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } else {
      throw new NotFoundException(`User with id ${id} not found`);
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
    this.users.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async deleteUser(id: string) {
    validateIdFormat(id);
    const user = this.users.find((user) => user.id === id);
    if (user) {
      this.users.splice(this.users.indexOf(user), 1);
    } else {
      throw new NotFoundException(`User with id ${id} not found`);
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

    const user: IUser = this.users.find((user) => user.id === id);

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
      const userIdx = this.users.indexOf(user);
      this.users[userIdx] = updatedUser;
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } else {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
