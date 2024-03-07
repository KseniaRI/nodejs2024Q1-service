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
  artistId: string | null;
}
