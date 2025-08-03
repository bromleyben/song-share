
import { Authenticator } from '@aws-amplify/ui-react';
import "@aws-amplify/ui-react/styles.css";
import { signIn, type SignInInput } from "aws-amplify/auth";
import "./App.css";
import { AuthContainer } from "./AuthContainer";

function App() {
  return (
    <Authenticator
      services={{
        handleSignIn({ username, password, options }: SignInInput) {
          return signIn({
            username,
            password,
            options: {
              ...options,
              authFlowType: "USER_PASSWORD_AUTH",
            },
          });
        },
      }}
    >
      <AuthContainer />
    </Authenticator>
  );
}

export default App
