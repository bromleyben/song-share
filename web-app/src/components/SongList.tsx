import type { Song } from "../artist/types";
import { useFileUri } from "../hooks/useFileUri";

export function SongList({ songs }: { songs: Song[] }) {
  if (songs.length === 0) {
    return (
      <div className="song-list-empty">
        <p>No songs uploaded yet. Upload your first song to get started!</p>
      </div>
    );
  }

  return (
    <div className="song-list">
      <h2 className="song-list-title">Songs</h2>
      <div className="song-grid">
        {songs.map(song => (
          <SongItem key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
}

function SongItem({ song }: { song: Song }) {
  const { uri: songFileUri } = useFileUri(song.song_file_key);

  return (
    <div className="song-item">
      <div className="song-header">
        <h3 className="song-name">{song.name}</h3>
        <div className="song-date">
          {new Date(song.created_at).toLocaleDateString()}
        </div>
      </div>
      <div className="song-player">
        {songFileUri ? (
          <audio src={songFileUri} controls className="audio-player" />
        ) : (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <span>Loading audio...</span>
          </div>
        )}
      </div>
    </div>
  );
}
