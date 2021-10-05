import React, { useEffect } from 'react';
import styles from '../styles/Home.module.css';
import StytchContainer from '../components/StytchContainer';
import { ServerSideProps } from '../lib/StytchSession';
import { useRouter } from 'next/router';

type Props = {
  token?: string;
};



// const users = async (): Promise<User[]> => { return getUsers()};

const Profile = (props: Props) => {
  const { token } = props;
  const router = useRouter();

  useEffect(() => {
    // if (!token) {
    //   router.replace('/');
    // }
  });


  const signOut = async () => {
    const resp = await fetch('/api/logout', { method: 'POST' });
    if (resp.status === 200) {
      router.push('/');
    }
  };

  console.log("inside profile")
  return (
        <>
        <div>
        <StytchContainer>
          <h1> Hello World</h1>
          </StytchContainer>
          <button className={styles.primaryButton} onClick={signOut}>
            Sign out
          </button>
          </div>
        </>
  );
};



const getServerSidePropsHandler: ServerSideProps = async ({ req}) => {  
  // Get the user's token based on the request
  return { props : { 
    token: req.cookies[process.env.COOKIE_NAME as string] || ""} };
};


export const getServerSideProps = getServerSidePropsHandler;

export default Profile;
