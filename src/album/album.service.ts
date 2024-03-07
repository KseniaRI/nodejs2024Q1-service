import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { validateIdFormat } from 'src/heplers/validateIdFormat';
import { IAlbum } from 'src/types/interfaces';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { isIdValid } from 'src/heplers/isIdValid';

@Injectable()
export class AlbumService {
  private albums: IAlbum[] = [];

  async getAlbums() {
    return this.albums;
  }

  async getAlbumById(id: string) {
    validateIdFormat(id);

    const album = this.albums.find((album) => album.id === id);
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
      this.albums.push(newAlbum);
      return newAlbum;
    }
  }

  async deleteAlbum(id: string) {
    validateIdFormat(id);
    const album = this.albums.find((album) => album.id === id);
    if (album) {
      this.albums.splice(this.albums.indexOf(album), 1);
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
    const album = this.albums.find((album) => album.id === id);
    if (album) {
      const updatedAlbum = {
        ...album,
        ...updateAlbumDto,
      };
      const albumIdx = this.albums.indexOf(album);
      this.albums[albumIdx] = updatedAlbum;
      return updatedAlbum;
    } else {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
  }
}
