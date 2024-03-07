import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { validateIdFormat } from 'src/heplers/validateIdFormat';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { isIdValid } from 'src/heplers/isIdValid';
import { DB } from 'src/db';
import { ITrack } from 'src/types/interfaces';

@Injectable()
export class AlbumService {
  constructor(@Inject('DB_CONNECTION') private readonly db: DB) {}

  async getAlbums() {
    return this.db.albums;
  }

  async getAlbumById(id: string) {
    validateIdFormat(id);

    const album = this.db.albums.find((album) => album.id === id);
    if (album) {
      return album;
    } else {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
  }

  async createAlbum(createAlbumDto: CreateAlbumDto) {
    if (
      !createAlbumDto.name ||
      typeof createAlbumDto.year !== 'number' ||
      typeof createAlbumDto.name !== 'string' ||
      !isIdValid(createAlbumDto.artistId)
    ) {
      throw new BadRequestException(
        'Request body does not contain required fields or their format is not correct',
      );
    } else {
      const newAlbum = {
        id: uuidv4(),
        ...createAlbumDto,
      };
      this.db.albums.push(newAlbum);
      return newAlbum;
    }
  }

  async deleteAlbum(id: string) {
    validateIdFormat(id);
    const album = this.db.albums.find((album) => album.id === id);
    if (album) {
      this.db.albums.splice(this.db.albums.indexOf(album), 1);
      this.db.tracks = this.db.tracks.map((track: ITrack) => {
        if (track.albumId === id) {
          return {
            ...track,
            albumId: null,
          };
        } else {
          return track;
        }
      });
      if (this.db.favs.albums.includes(id)) {
        const idx = this.db.favs.albums.indexOf(id);
        this.db.favs.albums.splice(idx, 1);
      }
    } else {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
  }

  async updateAlbum(updateAlbumDto: UpdateAlbumDto, id: string) {
    if (
      !updateAlbumDto.name ||
      typeof updateAlbumDto.year !== 'number' ||
      typeof updateAlbumDto.name !== 'string' ||
      !isIdValid(updateAlbumDto.artistId)
    ) {
      throw new BadRequestException(
        'Request body does not contain required fields or their format is not correct',
      );
    }
    validateIdFormat(id);
    const album = this.db.albums.find((album) => album.id === id);
    if (album) {
      const updatedAlbum = {
        ...album,
        ...updateAlbumDto,
      };
      const albumIdx = this.db.albums.indexOf(album);
      this.db.albums[albumIdx] = updatedAlbum;
      return updatedAlbum;
    } else {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
  }
}
