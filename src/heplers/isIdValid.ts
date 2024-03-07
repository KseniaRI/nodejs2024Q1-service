import { TAlbumId, TArtistId } from 'src/types/interfaces';
import { validateIdFormat } from './validateIdFormat';

export const isIdValid = (id: TArtistId | TAlbumId) => {
  if (id) {
    validateIdFormat(id);
  }
  return typeof id === 'string' || id === null;
};
