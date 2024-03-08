import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { DB } from 'src/db';
import { IAlbum, IArtist, ITrack } from 'src/types/interfaces';
import {
  addEntityToCollection,
  deleteEntityFromCollection,
  deleteIdFromFavs,
  getEntityById,
  replaceIdToNull,
  updateEntityInCollection,
  validateIdFormat,
} from 'src/heplers';

@Injectable()
export class ArtistService {
  constructor(@Inject('DB_CONNECTION') private readonly db: DB) {}

  private isInvalidDto(dto: CreateArtistDto | UpdateArtistDto) {
    return (
      !Object.keys(dto).includes('grammy') ||
      !dto.name ||
      typeof dto.grammy !== 'boolean' ||
      typeof dto.name !== 'string'
    );
  }

  async getArtists() {
    return this.db.artists;
  }

  async getArtistById(id: string) {
    return getEntityById<IArtist>(id, this.db.artists);
  }

  async createArtist(createArtistDto: CreateArtistDto) {
    if (this.isInvalidDto(createArtistDto)) {
      throw new BadRequestException(
        'Request body does not contain required fields or their format is not correct',
      );
    } else {
      return addEntityToCollection(createArtistDto, this.db.artists);
    }
  }

  async deleteArtist(id: string) {
    deleteEntityFromCollection(id, this.db.artists);
    deleteIdFromFavs(id, this.db.favs.artists);
    this.db.albums = replaceIdToNull<IAlbum>(id, this.db.albums, 'artistId');
    this.db.tracks = replaceIdToNull<ITrack>(id, this.db.tracks, 'artistId');
  }

  async updateArtist(updateArtistDto: UpdateArtistDto, id: string) {
    if (this.isInvalidDto(updateArtistDto)) {
      throw new BadRequestException(
        'Request body does not contain required fields or their format is not correct',
      );
    }
    validateIdFormat(id);
    const updatedArtist = updateEntityInCollection<IArtist>(
      id,
      updateArtistDto,
      this.db.artists,
    );
    return updatedArtist;
  }
}
