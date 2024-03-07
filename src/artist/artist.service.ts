import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { validateIdFormat } from 'src/heplers/validateIdFormat';
import { CreateArtistDto } from './dto/create-artist.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { DB } from 'src/db';
import { IAlbum, ITrack } from 'src/types/interfaces';

@Injectable()
export class ArtistService {
  constructor(@Inject('DB_CONNECTION') private readonly db: DB) {}

  async getArtists() {
    return this.db.artists;
  }

  async getArtistById(id: string) {
    validateIdFormat(id);

    const artist = this.db.artists.find((artist) => artist.id === id);
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
      this.db.artists.push(newArtist);
      return newArtist;
    }
  }

  async deleteArtist(id: string) {
    validateIdFormat(id);
    const artist = this.db.artists.find((artist) => artist.id === id);
    if (artist) {
      this.db.artists.splice(this.db.artists.indexOf(artist), 1);
      this.db.albums = this.db.albums.map((album: IAlbum) => {
        if (album.artistId === id) {
          return {
            ...album,
            artistId: null,
          };
        } else {
          return album;
        }
      });
      this.db.tracks = this.db.tracks.map((track: ITrack) => {
        if (track.artistId === id) {
          return {
            ...track,
            artistId: null,
          };
        } else {
          return track;
        }
      });
      if (this.db.favs.artists.includes(id)) {
        const idx = this.db.favs.artists.indexOf(id);
        this.db.favs.artists.splice(idx, 1);
      }
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
    const artist = this.db.artists.find((artist) => artist.id === id);
    if (artist) {
      const updatedArtist = {
        ...artist,
        ...updateArtistDto,
      };
      const artistIdx = this.db.artists.indexOf(artist);
      this.db.artists[artistIdx] = updatedArtist;
      return updatedArtist;
    } else {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }
  }
}
