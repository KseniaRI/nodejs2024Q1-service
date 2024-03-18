import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async getArtists() {
    const artists = await this.prisma.artist.findMany();
    return artists;
  }

  async getArtistById(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id,
      },
    });
    if (!artist) {
      throw new NotFoundException('Artist with id ${id} not found');
    }
    return artist;
  }

  async createArtist(createArtistDto: CreateArtistDto) {
    const newArtist = await this.prisma.artist.create({
      data: {
        id: uuidv4(),
        ...createArtistDto,
      },
    });
    return newArtist;
  }

  async deleteArtist(id: string) {
    // deleteEntityFromCollection(id, this.db.artists);
    // deleteIdFromFavs(id, this.db.favs.artists);
    // this.db.albums = replaceIdToNull<IAlbum>(id, this.db.albums, 'artistId');
    // this.db.tracks = replaceIdToNull<ITrack>(id, this.db.tracks, 'artistId');
    const artist = await this.prisma.artist.findUnique({
      where: {
        id,
      },
    });
    if (!artist) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    } else {
      await this.prisma.artist.delete({
        where: {
          id,
        },
      });
    }
  }

  async updateArtist(updateArtistDto: UpdateArtistDto, id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id,
      },
    });
    if (artist) {
      const updatedArtist = await this.prisma.artist.update({
        where: {
          id,
        },
        data: {
          ...artist,
          ...updateArtistDto,
        },
      });
      return updatedArtist;
    } else {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
  }
}
