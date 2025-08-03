import { get, post } from "aws-amplify/api";
import { fetchUserAttributes } from "aws-amplify/auth";
import { withAuthorizationHeaders } from "../auth/auth";
import type { Artist, ArtistWithSongs, Song } from "./types";

const apiName = "main";

export async function getArtist(id: string): Promise<ArtistWithSongs> {
  const result = await get({
    apiName,
    path: `artist/${id}`,
    options: {
      headers: await withAuthorizationHeaders(),
    },
  });

  return (await (await result.response).body.json()) as ArtistWithSongs;
}

export async function getOwnArtist(): Promise<ArtistWithSongs> {
  const user = await fetchUserAttributes();

  return await getArtist(user.sub as string);
}

export async function postSong(song: Song) {
  const user = await fetchUserAttributes();

  return post({
    apiName,
    path: `artist/${user.sub}/song`,

    options: {
      headers: await withAuthorizationHeaders(),
      body: {
        ...song,
        artist_id: user.sub as string,
      },
    },
  });
}

export async function getArtists(): Promise<Artist[]> {
  const result = await get({
    apiName,
    path: `artists`,
    options: {
      headers: await withAuthorizationHeaders(),
    },
  });

  return (await (await result.response).body.json()) as Artist[];
}

export async function followArtist(artist_id: string) {
  return post({
    apiName,
    path: `followings/${artist_id}`,
    options: {
      headers: await withAuthorizationHeaders(),
    },
  });
}
