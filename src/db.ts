/* eslint-disable prettier/prettier */
import { IAlbum, IArtist, IFavorites, ITrack, IUser } from './types/interfaces';

export interface DB {
  albums: IAlbum[];
  artists: IArtist[];
  tracks: ITrack[];
  users: IUser[];
  favs: IFavorites;
}

export const db: DB = {
  albums: [],
  artists: [],
  tracks: [],
  users: [],
  favs: {
    artists: [],
    albums: [],
    tracks: [],
  },
};
