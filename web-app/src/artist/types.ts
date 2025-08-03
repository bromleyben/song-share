export type Artist = {
  id: string;
  email: string;
  artist_id: string;
  created_at: string;
  updated_at: string;
};

export type Song = {
  id: string;
  name: string;
  artist_id: string;
  song_file_key: string;
  created_at: string;
  updated_at: string;
};

export type ArtistWithSongs = {
  artist: Artist;
  songs: Song[];
};
