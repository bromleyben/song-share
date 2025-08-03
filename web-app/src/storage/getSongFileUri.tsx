export function getSongFileUri(songFileKey: string) {
  return `https://song-share-user-files-dev.s3.amazonaws.com/${songFileKey}`;
}