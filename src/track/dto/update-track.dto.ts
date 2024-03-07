import { TAlbumId, TArtistId } from 'src/types/interfaces';

export class UpdateTrackDto {
  readonly name: string;
  readonly artistId: TArtistId;
  readonly albumId: TAlbumId;
  readonly duration: number;
}
