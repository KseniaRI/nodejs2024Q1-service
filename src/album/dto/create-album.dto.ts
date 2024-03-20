import { TArtistId } from 'src/types/interfaces';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly year: number;

  readonly favoritesId: string | null;

  @IsNotEmpty()
  readonly artistId: TArtistId;
}
