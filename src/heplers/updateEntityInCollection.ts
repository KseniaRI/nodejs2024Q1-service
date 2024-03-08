import { NotFoundException } from '@nestjs/common';

export const updateEntityInCollection = <T extends { id: string }>(
  id: string,
  entityDto: Partial<T>,
  collection: T[],
): T => {
  const entity = collection.find((entity) => entity.id === id);
  if (entity) {
    const updatedEntity = {
      ...entity,
      ...entityDto,
    };
    const idx = collection.indexOf(entity);
    collection[idx] = updatedEntity;
    return updatedEntity;
  } else {
    throw new NotFoundException(`Entity with id ${id} not found`);
  }
};
