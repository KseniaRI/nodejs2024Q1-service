import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  readonly artistId: string | null;

  readonly albumId: string | null;

  readonly favoritesId: string | null;

  @IsNumber()
  @IsNotEmpty()
  readonly duration: number;
}
