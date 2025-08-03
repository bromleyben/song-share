import { signOut } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { followArtist, getOwnArtist, postSong } from "./artist/api";
import type { ArtistWithSongs, Song } from "./artist/types";
import { ArtistBrowser } from "./ArtistBrowser";
import { ArtistProfile } from "./components/ArtistProfile";
import { SongList } from "./components/SongList";
import { SongUploadInput } from "./components/SongUploadInput";
import { uploadSongFile } from "./storage/uploadSongFile";

type Views =
  | { type: "my-profile" }
  | { type: "artist-browser" }
  | { type: "artist-profile"; artist_id: string };

export function AuthContainer() {
  const [ownArtist, setOwnArtist] = useState<ArtistWithSongs | null>(null);
  const [view, setView] = useState<Views>({ type: "my-profile" });

  useEffect(() => {
    getOwnArtist().then(setOwnArtist);
  }, []);

  function setViewedArtistId(artistId: string) {
    setView({ type: "artist-profile", artist_id: artistId });
  }

  function handleFollow(artist_id: string) {
    followArtist(artist_id);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const song = Object.fromEntries(formData);
    const file = formData.get("song_file") as File;
    const song_upload_result = await uploadSongFile(file);

    const songFileKey = (await (await song_upload_result).result).path;

    console.log(songFileKey);

    await postSong({
      name: song.name as string,
      song_file_key: songFileKey,
    } as unknown as Song);
  };

  return (
    <div>
      {view.type === "my-profile" && (
        <div>
          <button onClick={() => signOut()}>Sign Out</button>
          <h1>Hello {ownArtist?.artist?.email}</h1>
          <SongList songs={ownArtist?.songs || []} />
          <SongUploadInput onSubmit={handleSubmit} />
          <button onClick={() => setView({ type: "artist-browser" })}>
            View Artists
          </button>
        </div>
      )}

      {view.type === "artist-browser" && (
        <ArtistBrowser
          onArtistClick={setViewedArtistId}
          onBack={() => setView({ type: "my-profile" })}
        />
      )}

      {"type" in view && view.type === "artist-profile" && (
        <ArtistProfile
          artist_id={view.artist_id}
          onFollow={handleFollow}
          onBack={() => setView({ type: "artist-browser" })}
        />
      )}
    </div>
  );
}
