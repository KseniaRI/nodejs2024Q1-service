/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { validate } from 'uuid';

@Injectable()
export class FavsService {
  constructor(private prisma: PrismaService) {}

  private async checkExistingFavorites() {
    const existingFavorites = await this.prisma.favorites.findFirst();
    if (!existingFavorites) {
      await this.prisma.favorites.create({
        data: {} as Prisma.FavoritesCreateInput,
      });
    }
  }
  private async getArtist(id: string) {
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
    return artist;
  }
  private async getAlbum(id: string) {
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
    return album;
  }
  private async getTrack(id: string) {
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
    return track;
  }

  async getFavs() {
    await this.checkExistingFavorites();
    const favorites = await this.prisma.favorites.findFirst({
      select: {
        albums: true,
        artists: true,
        tracks: true,
      },
    });
    const result = Object.entries(favorites).reduce((acc, [key, value]) => {
      acc[key] = value.map((item: any) => {
        const { favoritesId, ...rest } = item;
        return rest;
      });
      return acc;
    }, {});

    return result;
  }

  async addTrack(id: string) {
    validate(id);
    const track = await this.getTrack(id);
    if (track) {
      await this.checkExistingFavorites();
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
  }

  async addAlbum(id: string) {
    validate(id);
    const album = await this.getAlbum(id);
    if (album) {
      await this.checkExistingFavorites();
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
  }

  async addArtist(id: string) {
    validate(id);
    const artist = await this.getArtist(id);
    if (artist) {
      await this.checkExistingFavorites();
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
  }

  async deleteArtist(id: string) {
    validate(id);
    const artist = await this.getArtist(id);
    if (artist) {
      await this.prisma.artist.update({
        where: {
          id,
        },
        data: {
          favoritesId: null,
        } as Prisma.TrackUpdateInput,
      });
    }
  }

  async deleteAlbum(id: string) {
    validate(id);
    const album = await this.getAlbum(id);
    if (album) {
      await this.prisma.album.update({
        where: {
          id,
        },
        data: {
          favoritesId: null,
        } as Prisma.TrackUpdateInput,
      });
    }
  }

  async deleteTrack(id: string) {
    validate(id);
    const track = await this.getTrack(id);
    if (track) {
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
}
