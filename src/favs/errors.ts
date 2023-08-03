export class FavoritesError extends Error {}

export class FavoritesCreateError extends FavoritesError {
  constructor() {
    super('can not be added to favorites, entity does not exist');
  }
}

export class FavoritesDeleteError extends FavoritesError {
  constructor() {
    super('can not be deleted from favorites, entity does not exist');
  }
}
