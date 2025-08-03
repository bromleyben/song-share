import { fetchAuthSession } from "aws-amplify/auth";

export async function getIdToken() {
  return (await fetchAuthSession()).tokens?.idToken?.toString() as string;
}

export async function withAuthorizationHeaders(
  headers?: Record<string, string>
) {
  return {
    ...headers,
    Authorization: await getIdToken(),
  };
}
