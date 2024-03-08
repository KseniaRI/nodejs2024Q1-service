import { NotFoundException } from '@nestjs/common';
import { validateIdFormat } from './validateIdFormat';

export const getEntityById = <T extends { id: string }>(
  id: string,
  collection: T[],
): T => {
  validateIdFormat(id);
  const entity = collection.find((entity) => entity.id === id);
  if (entity) {
    return entity;
  } else {
    throw new NotFoundException(`Entity with id ${id} not found`);
  }
};
