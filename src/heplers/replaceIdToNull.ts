export const replaceIdToNull = <T extends { id: string }>(
  id: string,
  collection: T[],
  keyToNull: string,
): T[] => {
  const updatedCollection = collection.map((entity: T) => {
    if (entity[keyToNull] === id) {
      return {
        ...entity,
        [keyToNull]: null,
      };
    } else {
      return entity;
    }
  });
  return updatedCollection;
};
