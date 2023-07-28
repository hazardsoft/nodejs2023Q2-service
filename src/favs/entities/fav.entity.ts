import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';

export class FavoritesIds {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}

export class Favorites {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
