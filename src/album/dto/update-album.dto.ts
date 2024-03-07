import { TArtistId } from './create-album.dto';

export class UpdateAlbumDto {
  readonly name: string;
  readonly year: number;
  readonly artistId: TArtistId;
}
