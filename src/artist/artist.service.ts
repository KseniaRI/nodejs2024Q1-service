import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { validateIdFormat } from 'src/heplers/validateIdFormat';
import { CreateArtistDto } from './dto/create-artist.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { IArtist } from 'src/types/interfaces';

@Injectable()
export class ArtistService {
  private artists: IArtist[] = [];

  async getArtists() {
    return this.artists;
  }

  async getArtistById(id: string) {
    validateIdFormat(id);

    const artist = this.artists.find((artist) => artist.id === id);
    if (artist) {
      return artist;
    } else {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
  }

  async createArtist(createArtistDto: CreateArtistDto) {
    if (
      !Object.keys(createArtistDto).includes('grammy') ||
      !createArtistDto.name ||
      typeof createArtistDto.grammy !== 'boolean' ||
      typeof createArtistDto.name !== 'string'
    ) {
      throw new BadRequestException(
        'Request body does not contain required fields or their format is not correct',
      );
    } else {
      const newArtist = {
        id: uuidv4(),
        ...createArtistDto,
      };
      this.artists.push(newArtist);
      return newArtist;
    }
  }

  async deleteArtist(id: string) {
    validateIdFormat(id);
    const artist = this.artists.find((artist) => artist.id === id);
    if (artist) {
      this.artists.splice(this.artists.indexOf(artist), 1);
    } else {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
  }

  async updateArtist(updateArtistDto: UpdateArtistDto, id: string) {
    if (
      !Object.keys(updateArtistDto).includes('grammy') ||
      !updateArtistDto.name ||
      typeof updateArtistDto.grammy !== 'boolean' ||
      typeof updateArtistDto.name !== 'string'
    ) {
      throw new BadRequestException(
        'Request body does not contain required fields or their format is not correct',
      );
    }
    validateIdFormat(id);
    const artist = this.artists.find((artist) => artist.id === id);
    if (artist) {
      const updatedArtist = {
        ...artist,
        ...updateArtistDto,
      };
      const artistIdx = this.artists.indexOf(artist);
      this.artists[artistIdx] = updatedArtist;
      return updatedArtist;
    } else {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
  }
}
