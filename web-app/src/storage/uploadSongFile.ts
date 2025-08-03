import { uploadData } from "aws-amplify/storage";

export async function uploadSongFile(file: File) {
  return await uploadData({
    data: file,
    path: ({ identityId }) => `protected/${identityId}/${file.name}`,
  });
}
