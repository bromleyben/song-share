import { getUrl } from "aws-amplify/storage";
import { useEffect, useState } from "react";

type FileUri = {
  uri: string | undefined;
  isLoading: boolean;
  error: string | undefined;
};

export function useFileUri(key?: string) {
  const [state, setState] = useState<FileUri>({
    uri: undefined,
    isLoading: false,
    error: undefined,
  });

  useEffect(() => {
    async function loadFileUri() {
      if (key) {
        setState({
          uri: undefined,
          isLoading: true,
          error: undefined,
        });

        const { url } = await getUrl({
          path: key,
          options: {
            validateObjectExistence: false, // Check if object exists before creating a URL
            expiresIn: 20, // validity of the URL, in seconds. defaults to 900 (15 minutes) and maxes at 3600 (1 hour)
          },
        });

        setState({
          uri: url.toString(),
          isLoading: false,
          error: undefined,
        });
      }
    }
    loadFileUri();
  }, [key]);

  return state;
}
