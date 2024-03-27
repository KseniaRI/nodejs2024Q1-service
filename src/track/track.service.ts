import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4, validate } from 'uuid';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  private async getExistedTrack(id: string) {
    const track = await this.prisma.track.findUnique({
      where: {
        id,
      },
    });
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return track;
  }

  async getTracks() {
    const tracks = await this.prisma.track.findMany();
    return tracks;
  }

  async getTrackById(id: string) {
    validate(id);
    const track = await this.getExistedTrack(id);
    if (track) {
      return track;
    }
  }

  async createTrack(createTrackDto: CreateTrackDto) {
    const newTrack = await this.prisma.track.create({
      data: {
        id: uuidv4(),
        ...createTrackDto,
      },
    });
    return newTrack;
  }

  async deleteTrack(id: string) {
    validate(id);
    const track = await this.getExistedTrack(id);
    if (track) {
      await this.prisma.track.delete({
        where: {
          id,
        },
      });
    }
  }

  async updateTrack(updateTrackDto: UpdateTrackDto, id: string) {
    validate(id);
    const track = await this.getExistedTrack(id);
    if (track) {
      const updatedTrack = await this.prisma.track.update({
        where: {
          id,
        },
        data: {
          ...track,
          ...updateTrackDto,
        },
      });
      return updatedTrack;
    }
  }
}
