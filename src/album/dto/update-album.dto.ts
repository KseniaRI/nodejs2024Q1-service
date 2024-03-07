import { TArtistId } from 'src/types/interfaces';

export class UpdateAlbumDto {
  readonly name: string;
  readonly year: number;
  readonly artistId: TArtistId;
}
