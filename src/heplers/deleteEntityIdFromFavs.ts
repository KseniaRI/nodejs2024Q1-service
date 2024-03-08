import { NotFoundException } from '@nestjs/common';
import { validateIdFormat } from './validateIdFormat';

export const deleteEntityIdFromFavs = (id: string, collection: string[]) => {
  validateIdFormat(id);
  if (collection.includes(id)) {
    const idx = collection.indexOf(id);
    collection.splice(idx, 1);
  } else {
    throw new NotFoundException(`Entity with id ${id} is not favorite`);
  }
};
