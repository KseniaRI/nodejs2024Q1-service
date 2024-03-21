import { TAlbumId, TArtistId } from 'src/types/interfaces';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  readonly artistId: TArtistId;

  readonly albumId: TAlbumId;

  readonly favoritesId: string | null;

  @IsNumber()
  @IsNotEmpty()
  readonly duration: number;
}
