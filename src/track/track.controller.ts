import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return await this.trackService.getTracks();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string) {
    return await this.trackService.getTrackById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTrackDto: CreateTrackDto) {
    return await this.trackService.createTrack(createTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return await this.trackService.deleteTrack(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() updateTrackDto: UpdateTrackDto,
    @Param('id') id: string,
  ) {
    return await this.trackService.updateTrack(updateTrackDto, id);
  }
}
