export const usersRoutes = {
  getAll: '/user',
  getById: (userId: string) => `/user/${userId}`,
  create: '/user',
  update: (userId: string) => `/user/${userId}`,
  delete: (userId: string) => `/user/${userId}`,
};

export const artistsRoutes = {
  getAll: '/artist',
  getById: (artistId: string) => `/artist/${artistId}`,
  create: '/artist',
  update: (artistId: string) => `/artist/${artistId}`,
  delete: (artistId: string) => `/artist/${artistId}`,
};

export const albumsRoutes = {
  getAll: '/album',
  getById: (albumId: string) => `/album/${albumId}`,
  create: '/album',
  update: (albumId: string) => `/album/${albumId}`,
  delete: (albumId: string) => `/album/${albumId}`,
};

export const tracksRoutes = {
  getAll: '/track',
  getById: (trackId: string) => `/track/${trackId}`,
  create: '/track',
  update: (trackId: string) => `/track/${trackId}`,
  delete: (trackId: string) => `/track/${trackId}`,
};

export const favoritesRoutes = {
  getAll: '/favs',
  artists: (artistId: string) => `/favs/artist/${artistId}`,
  albums: (albumId: string) => `/favs/album/${albumId}`,
  tracks: (trackId: string) => `/favs/track/${trackId}`,
};

export const authRoutes = {
  signup: '/auth/signup',
  login: '/auth/login',
  refresh: '/auth/refresh',
};
