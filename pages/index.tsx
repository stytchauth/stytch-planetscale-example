import { Stytch } from '@stytch/stytch-react';
import styles from '../styles/Home.module.css';
// import withSession, { ServerSideProps } from '../lib/withSession';
import { ServerSideProps } from '../lib/StytchSession';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { LoginMethod } from '../lib/types';
import LoginEntryPoint from '../components/LoginEntrypoint';

const stytchProps = {
  config: {
    loginConfig: {
      magicLinkUrl: `http://localhost:3000/api/authenticate_magic_link`,
      expirationMinutes: 30,
    },
    createUserConfig: {
      magicLinkUrl: `http://localhost:3000/api/authenticate_magic_link`,
      expirationMinutes: 30,
    },
  },
  style: {
    fontFamily: '"Helvetica New", Helvetica, sans-serif',
    button: {
      backgroundColor: '#0577CA',
    },
    input: {
      textColor: '#090909',
    },
    width: '321px',
  },
  publicToken: process.env.STYTCH_PUBLIC_TOKEN || '',
  url: process.env.REACT_APP_STYTCH_JS_SDK_URL || 'https://js.stytch.com/stytch.js',
  callbacks: {
    onEvent: (data: any) => {
      if (data.eventData.type === 'USER_EVENT_TYPE') {
        console.log({
          userId: data.eventData.userId,
          email: data.eventData.email,
        });
      }
    },
    onSuccess: (data: any) => console.log(data),
    onError: (data: any) => console.log(data),
  },
};

type Props = {
  publicToken: string;
  user: {
    id: string;
  };
};

const App = (props: Props) => {
  const { user, publicToken, url } = props;
  const [loginMethod, setLoginMethod] = React.useState<LoginMethod | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/profile');
    }
  });

  const loginMethodMap: Record<LoginMethod, React.ReactElement> = {
    [LoginMethod.SDK]: (
      <div className={styles.container}>
        <Stytch
          publicToken={stytchProps.publicToken}
          config={stytchProps.config}
          style={stytchProps.style}
          callbacks={stytchProps.callbacks}
          _url={stytchProps.url}
        />
      </div>
    ),
  };

  return (
    <div className={styles.root}>
      {loginMethod === null ? <LoginEntryPoint setLoginMethod={setLoginMethod} /> : loginMethodMap[loginMethod]}
    </div>
  );
};

const getServerSidePropsHandler: ServerSideProps = async ({ req }) => {
  // Get the user's session based on the request
  return { props: { token: req.cookies[process.env.COOKIE_NAME as string] || '' } };
};

export const getServerSideProps = getServerSidePropsHandler;

export default App;
