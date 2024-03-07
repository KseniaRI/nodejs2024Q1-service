import { Inject, Injectable } from '@nestjs/common';
import { IFavoritesResponse } from 'src/types/interfaces';
import { DB } from 'src/db';

@Injectable()
export class FavsService {
  private favsResponse: IFavoritesResponse = {
    artists: [],
    albums: [],
    tracks: [],
  };
  constructor(@Inject('DB_CONNECTION') private readonly db: DB) {}

  async addTrack(id: string) {
    this.db.favs.tracks.push(id);
    const track = this.db.tracks.find((track) => track.id === id);
    this.favsResponse.tracks.push(track);
    return this.favsResponse;
  }
}
