import loadStytch from './loadStytch';
import { NextApiRequest } from 'next';

const client = loadStytch();

export async function validSessionToken(token: string): Promise<boolean> {
  //authenticate the session

  try {
    const sessionAuthResp = await client.sessions.authenticate({ session_token: token });

    if (sessionAuthResp.status_code != 200) {
      console.error('Failed to validate session');
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export type ServerSideProps = ({ req }: { req: NextApiRequest }) => Promise<any>;
