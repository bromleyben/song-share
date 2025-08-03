import { useEffect, useState } from "react";
import { getArtists } from "./artist/api";
import type { Artist } from "./artist/types";

type ArtistBrowserProps = {
  onArtistClick: (artistId: string) => void;
  onBack: () => void;
};

export function ArtistBrowser({ onArtistClick, onBack }: ArtistBrowserProps) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArtists()
      .then(setArtists)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="artist-browser">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading artists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="artist-browser">
      <button onClick={onBack}>Back</button>
      <div className="artist-browser-header">
        <h1 className="artist-browser-title">Discover Artists</h1>
        <p className="artist-browser-subtitle">
          Explore music from talented artists in the community
        </p>
      </div>

      {artists.length === 0 ? (
        <div className="artist-list-empty">
          <p>No artists found. Be the first to join!</p>
        </div>
      ) : (
        <div className="artist-grid">
          {artists.map(artist => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onClick={() => onArtistClick(artist.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ArtistCard({
  artist,
  onClick,
}: {
  artist: Artist;
  onClick: () => void;
}) {
  return (
    <button className="artist-card" onClick={onClick}>
      <div className="artist-avatar">
        <div className="avatar-placeholder">
          {artist.email.charAt(0).toUpperCase()}
        </div>
      </div>
      <div className="artist-info">
        <h3 className="artist-name">{artist.email}</h3>
        <p className="artist-joined">
          Joined {new Date(artist.created_at).toLocaleDateString()}
        </p>
      </div>
    </button>
  );
}
