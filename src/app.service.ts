import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcom to Home Music Library Service! Go to http://localhost:4000/api';
  }
}
