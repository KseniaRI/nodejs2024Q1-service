import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FavsService {
  constructor(private prisma: PrismaService) {}

  async getFavs() {
    const favorites = await this.prisma.favorites.findFirst({
      select: {
        albums: true,
        artists: true,
        tracks: true,
      },
    });
    return favorites;
  }

  async addTrack(id: string) {
    const track = await this.prisma.track.findUnique({
      where: {
        id,
      },
    });

    if (!track) {
      throw new UnprocessableEntityException(
        `Track with id ${id} doesn't exist`,
      );
    }

    await this.prisma.track.update({
      where: {
        id,
      },
      data: {
        favoritesId: 'favoriteId',
      } as Prisma.TrackUpdateInput,
    });
    return track;
  }

  async addAlbum(id: string) {
    const album = await this.prisma.album.findUnique({
      where: {
        id,
      },
    });

    if (!album) {
      throw new UnprocessableEntityException(
        `Album with id ${id} doesn't exist`,
      );
    }

    await this.prisma.album.update({
      where: {
        id,
      },
      data: {
        favoritesId: 'favoriteId',
      } as Prisma.TrackUpdateInput,
    });
    return album;
  }

  async addArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id,
      },
    });

    if (!artist) {
      throw new UnprocessableEntityException(
        `Artist with id ${id} doesn't exist`,
      );
    }

    await this.prisma.artist.update({
      where: {
        id,
      },
      data: {
        favoritesId: 'favoriteId',
      } as Prisma.TrackUpdateInput,
    });
    return artist;
  }

  async deleteArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id,
      },
    });

    if (!artist) {
      throw new UnprocessableEntityException(
        `Artist with id ${id} doesn't exist`,
      );
    }
    await this.prisma.artist.update({
      where: {
        id,
      },
      data: {
        favoritesId: null,
      } as Prisma.TrackUpdateInput,
    });
  }

  async deleteAlbum(id: string) {
    const album = await this.prisma.album.findUnique({
      where: {
        id,
      },
    });

    if (!album) {
      throw new UnprocessableEntityException(
        `Album with id ${id} doesn't exist`,
      );
    }
    await this.prisma.album.update({
      where: {
        id,
      },
      data: {
        favoritesId: null,
      } as Prisma.TrackUpdateInput,
    });
  }

  async deleteTrack(id: string) {
    const track = await this.prisma.track.findUnique({
      where: {
        id,
      },
    });

    if (!track) {
      throw new UnprocessableEntityException(
        `Track with id ${id} doesn't exist`,
      );
    }
    await this.prisma.track.update({
      where: {
        id,
      },
      data: {
        favoritesId: null,
      } as Prisma.TrackUpdateInput,
    });
  }
}
