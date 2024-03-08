import { Inject, Injectable } from '@nestjs/common';
import {
  IAlbum,
  IArtist,
  IFavoritesResponse,
  ITrack,
} from 'src/types/interfaces';
import { DB } from 'src/db';
import { addIdToFavsCollection, deleteEntityIdFromFavs } from 'src/heplers';

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
    const track = addIdToFavsCollection<ITrack>(
      id,
      this.db.tracks,
      this.db.favs.tracks,
    );
    return track;
  }

  async addAlbum(id: string) {
    const album = addIdToFavsCollection<IAlbum>(
      id,
      this.db.albums,
      this.db.favs.albums,
    );
    return album;
  }

  async addArtist(id: string) {
    const artist = addIdToFavsCollection<IArtist>(
      id,
      this.db.artists,
      this.db.favs.artists,
    );
    return artist;
  }

  async deleteArtist(id: string) {
    deleteEntityIdFromFavs(id, this.db.favs.artists);
  }

  async deleteAlbum(id: string) {
    deleteEntityIdFromFavs(id, this.db.favs.albums);
  }

  async deleteTrack(id: string) {
    deleteEntityIdFromFavs(id, this.db.favs.tracks);
  }
}
