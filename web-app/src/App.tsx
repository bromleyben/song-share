
import { Authenticator } from '@aws-amplify/ui-react';
import "@aws-amplify/ui-react/styles.css";
import { signIn, type SignInInput } from 'aws-amplify/auth';
import './App.css';

function App() {
  return  <Authenticator
  services={{
    handleSignIn({ username, password, options }: SignInInput) {
      return signIn({
        username,
        password,
        options: {
          ...options,
          authFlowType: 'USER_PASSWORD_AUTH',
        },
      });
    },
  }}
>
  You are authed
</Authenticator>
}

export default App
