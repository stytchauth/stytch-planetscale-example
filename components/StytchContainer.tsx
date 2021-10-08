import React from 'react';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import stytch from '/public/powered-by-stytch.svg';
import planetscale from '/public/powered-by-planetscale.png';

type Props = {
  children: React.ReactElement | React.ReactElement[];
};

const StytchContainer = (props: Props) => {
  const { children } = props;
  return (
    <div className={styles.container}>
      <div>{children}</div>
      <div className={styles.watermark}>
        <Image alt="Powered by Stytch" height={15} src={stytch} width={250} />
        <p className={styles.ampersand}> & </p>
        <Image className={styles.image} alt="Powered by Planetscale" src={planetscale} height={25} width={175} />
      </div>
    </div>
  );
};

export default StytchContainer;
