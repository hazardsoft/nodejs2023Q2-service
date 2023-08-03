export class FavoritesError extends Error {}

export class FavoritesDoesNotExist extends FavoritesError {
  constructor() {
    super('can not be added to favorites, entity does not exist');
  }
}
