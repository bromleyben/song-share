import { useEffect, useState } from "react";
import { getArtist } from "../artist/api";
import type { ArtistWithSongs } from "../artist/types";
import { SongList } from "./SongList";

type ArtistProfileProps = {
  artist_id: string;
  onFollow?: (artist_id: string) => void;
  onBack: () => void;
};

export function ArtistProfile({
  artist_id,
  onFollow,
  onBack,
}: ArtistProfileProps) {
  const [data, setArtist] = useState<ArtistWithSongs | null>(null);

  useEffect(() => {
    getArtist(artist_id).then(setArtist);
  }, [artist_id]);

  if (!data) {
    return <div>Loading...</div>;
  }

  const { artist, songs } = data;

  return (
    <div>
      <button onClick={onBack}>Back</button>
      <h1>{artist.email}</h1>

      {onFollow ? (
        <button onClick={() => onFollow?.(artist_id)}>Follow</button>
      ) : null}

      <SongList songs={songs} />
    </div>
  );
}
