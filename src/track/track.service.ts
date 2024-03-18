import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async getTracks() {
    const tracks = await this.prisma.track.findMany();
    return tracks;
  }

  async getTrackById(id: string) {
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

  async createTrack(createTrackDto: CreateTrackDto) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id: createTrackDto.artistId,
      },
    });
    const album = await this.prisma.album.findUnique({
      where: {
        id: createTrackDto.albumId,
      },
    });
    if (!artist || !album) {
      throw new NotFoundException(`Entity with artistId or albumId not found`);
    }

    const newTrack = await this.prisma.track.create({
      data: {
        id: uuidv4(),
        ...createTrackDto,
      },
    });
    return newTrack;
  }

  async deleteTrack(id: string) {
    // deleteEntityFromCollection(id, this.db.tracks);
    // deleteIdFromFavs(id, this.db.favs.tracks);
    const track = await this.prisma.track.findUnique({
      where: {
        id,
      },
    });
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    await this.prisma.track.delete({
      where: {
        id,
      },
    });
  }

  async updateTrack(updateTrackDto: UpdateTrackDto, id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id: updateTrackDto.artistId,
      },
    });
    const album = await this.prisma.album.findUnique({
      where: {
        id: updateTrackDto.albumId,
      },
    });
    if (!artist || !album) {
      throw new NotFoundException(
        `Entity with id artistId or albumId not found`,
      );
    }
    const track = await this.prisma.track.findUnique({
      where: {
        id,
      },
    });
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
    } else {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
  }
}
