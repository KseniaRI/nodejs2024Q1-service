export class CreateAlbumDto {
  readonly name: string;
  readonly year: number;
  readonly artistId: TArtistId;
}

export type TArtistId = string | null;
