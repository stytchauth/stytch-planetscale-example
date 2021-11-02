import { SDKProductTypes, Stytch, StytchProps } from '@stytch/stytch-react';
import styles from '../styles/Home.module.css';
import { ServerSideProps } from '../lib/StytchSession';
import { BASE_URL } from '../lib/constants';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const stytchProps: StytchProps = {
  loginOrSignupView: {
    products: [SDKProductTypes.emailMagicLinks],
    emailMagicLinksOptions: {
      loginRedirectURL: `${BASE_URL}/api/authenticate_magic_link`,
      loginExpirationMinutes: 30,
      signupRedirectURL: `${BASE_URL}/api/authenticate_magic_link`,
      signupExpirationMinutes: 30,
    }
  },
  style: {
    fontFamily: '"Helvetica New", Helvetica, sans-serif',
    primaryColor: '#19303D',
    primaryTextColor: '#090909',
    width: '321px',
  },
  publicToken: process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN || '',
  callbacks: {
    onEvent: (data: any) => console.log(data),
    onSuccess: (data: any) => console.log(data),
    onError: (data: any) => console.log(data),
  },
};

type Props = {
  token: string;
};

const App = (props: Props) => {
  const { token } = props;
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push('/profile');
    }
  });

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <Stytch
          publicToken={stytchProps.publicToken}
          loginOrSignupView={stytchProps.loginOrSignupView}
          style={stytchProps.style}
          callbacks={stytchProps.callbacks}
        />
      </div>
    </div>
  );
};

const getServerSidePropsHandler: ServerSideProps = async ({ req }) => {
  // Get the user's session based on the request
  return {
    props: {
      token: req.cookies[process.env.COOKIE_NAME as string] || '',
    },
  };
};

export const getServerSideProps = getServerSidePropsHandler;

export default App;
