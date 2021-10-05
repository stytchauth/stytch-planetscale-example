import React from 'react';
import styles from '../styles/Home.module.css';
import StytchContainer from './StytchContainer';

type Props = {
  setLoginMethod: () => void;
};

const LoginEntryPoint = (props: Props) => {
  const { setLoginMethod } = props;

  return (
    <StytchContainer>
      <h2>Login or Signup</h2>
      <button className={styles.entryButton} onClick={() => setLoginMethod()}>
        Continue with email
      </button>
    </StytchContainer>
  );
};

export default LoginEntryPoint;
