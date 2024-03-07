import { TAlbumId, TArtistId } from 'src/types/interfaces';

export class AddTrackDto {
  readonly id: string;
  readonly name: string;
  readonly artistId: TArtistId;
  readonly albumId: TAlbumId;
  readonly duration: number;
}
