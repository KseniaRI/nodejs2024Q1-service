import { UnprocessableEntityException } from '@nestjs/common';
import { validateIdFormat } from './validateIdFormat';

export const addIdToFavsCollection = <T extends { id: string }>(
  id: string,
  collection: T[],
  favsCollection: string[],
): T => {
  validateIdFormat(id);
  const entity = collection.find((entity) => entity.id === id);
  if (entity) {
    favsCollection.push(id);
    return entity;
  } else {
    throw new UnprocessableEntityException(
      `Entity with id ${id} doesn't exist`,
    );
  }
};
