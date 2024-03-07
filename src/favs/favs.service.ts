import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IAlbum, IFavoritesResponse, ITrack } from 'src/types/interfaces';
import { DB } from 'src/db';
import { validateIdFormat } from 'src/heplers/validateIdFormat';

@Injectable()
export class FavsService {
  constructor(@Inject('DB_CONNECTION') private readonly db: DB) {}

  async getFavs() {
    const favsResponse: IFavoritesResponse = {
      artists: [],
      albums: [],
      tracks: [],
    };
    Object.entries(this.db.favs).map(([key, value]) => {
      const favorites = value.map((favId: string) => {
        const favorite = this.db[key].find((el: any) => el.id === favId);
        return favorite;
      });
      favsResponse[key] = favorites;
    });
    return favsResponse;
  }

  async addTrack(id: string) {
    validateIdFormat(id);
    const track = this.db.tracks.find((track) => track.id === id);
    if (track) {
      this.db.favs.tracks.push(id);
      return track;
    } else {
      throw new UnprocessableEntityException(
        `Track with id ${id} doesn't exist`,
      );
    }
  }

  async addAlbum(id: string) {
    validateIdFormat(id);
    const album = this.db.albums.find((album) => album.id === id);
    if (album) {
      this.db.favs.albums.push(id);
      return album;
    } else {
      throw new UnprocessableEntityException(
        `Album with id ${id} doesn't exist`,
      );
    }
  }

  async addArtist(id: string) {
    validateIdFormat(id);
    const artist = this.db.artists.find((artist) => artist.id === id);
    if (artist) {
      this.db.favs.artists.push(id);
      return artist;
    } else {
      throw new UnprocessableEntityException(
        `Artist with id ${id} doesn't exist`,
      );
    }
  }

  async deleteArtist(id: string) {
    validateIdFormat(id);
    const artist = this.db.favs.artists.find((artistId) => artistId === id);
    if (artist) {
      const dbIdx = this.db.favs.artists.indexOf(artist);
      this.db.favs.artists.splice(dbIdx, 1);
    } else {
      throw new NotFoundException(`Artist with id ${id} is not favorite`);
    }
  }

  async deleteAlbum(id: string) {
    validateIdFormat(id);
    const album = this.db.favs.albums.find((albumId) => albumId === id);
    if (album) {
      const dbIdx = this.db.favs.albums.indexOf(album);
      this.db.favs.albums.splice(dbIdx, 1);
    } else {
      throw new NotFoundException(`Album with id ${id} is not favorite`);
    }
  }

  async deleteTrack(id: string) {
    validateIdFormat(id);
    const track = this.db.favs.tracks.find((trackId) => trackId === id);
    if (track) {
      const dbIdx = this.db.favs.tracks.indexOf(track);
      this.db.favs.tracks.splice(dbIdx, 1);
    } else {
      throw new NotFoundException(`Track with id ${id} is not favorite`);
    }
  }
}
