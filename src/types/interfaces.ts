/* eslint-disable prettier/prettier */
export interface IUser {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export interface IArtist {
  id: string;
  name: string;
  grammy: boolean;
}

export interface IAlbum {
  id: string;
  name: string;
  year: number;
  artistId: TArtistId;
}

export interface ITrack {
  id: string;
  name: string;
  artistId: TArtistId;
  albumId: TAlbumId;
  duration: number;
}

export type TArtistId = string | null;
export type TAlbumId = string | null;
