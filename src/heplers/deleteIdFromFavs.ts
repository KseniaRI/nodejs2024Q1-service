export const deleteIdFromFavs = (id: string, collection: string[]) => {
  if (collection.includes(id)) {
    const idx = collection.indexOf(id);
    collection.splice(idx, 1);
  }
};
