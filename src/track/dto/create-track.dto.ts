import { TAlbumId, TArtistId } from 'src/types/interfaces';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly artistId: TArtistId;

  @IsNotEmpty()
  readonly albumId: TAlbumId;

  readonly favoritesId: string | null;

  @IsNumber()
  @IsNotEmpty()
  readonly duration: number;
}
