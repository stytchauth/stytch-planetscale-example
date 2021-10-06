import { Stytch } from '@stytch/stytch-react';
import styles from '../styles/Home.module.css';
import { ServerSideProps } from '../lib/StytchSession';
import { BASE_URL } from '../lib/constants';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const stytchProps = {
  config: {
    loginConfig: {
      magicLinkUrl: `${BASE_URL}/api/authenticate_magic_link`,
      expirationMinutes: 30,
    },
    createUserConfig: {
      magicLinkUrl: `${BASE_URL}/api/authenticate_magic_link`,
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
  callbacks: {
    onEvent: (data: any) => {
      // TODO: check whether the user exists in your DB
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
  const { user } = props;
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/profile');
    }
  });

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <Stytch
          publicToken={process.env.STYTCH_PUBLIC_TOKEN || ''}
          config={stytchProps.config}
          style={stytchProps.style}
          callbacks={stytchProps.callbacks}
        />
      </div>{' '}
    </div>
  );
};

const getServerSidePropsHandler: ServerSideProps = async ({ req }) => {
  // Get the user's session based on the request
  return { props: { token: req.cookies[process.env.COOKIE_NAME as string] || '' } };
};

export const getServerSideProps = getServerSidePropsHandler;

export default App;
