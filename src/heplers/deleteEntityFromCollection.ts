import { NotFoundException } from '@nestjs/common';
import { validateIdFormat } from './validateIdFormat';

export const deleteEntityFromCollection = <T extends { id: string }>(
  id: string,
  collection: T[],
) => {
  validateIdFormat(id);
  const entity: T = collection.find((entity) => entity.id === id);
  if (entity) {
    collection.splice(collection.indexOf(entity), 1);
  } else {
    throw new NotFoundException(`Entity with id ${id} not found`);
  }
};
