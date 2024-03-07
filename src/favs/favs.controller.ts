import { Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  async create(@Param('id') id: string) {
    return await this.favsService.addTrack(id);
  }
}
