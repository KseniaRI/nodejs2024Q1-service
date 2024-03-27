import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Welcome to Home Music Library Service! Go to http://localhost:${process.env.PORT}/api`;
  }
}
