import loadStytch from './loadStytch';
import { NextApiRequest, NextApiResponse } from 'next';
import Cookies from 'cookies';
import { FlashOffRounded } from '@mui/icons-material';

const client = loadStytch();
type APIHandler = (req: NextApiRequest, res: NextApiResponse<any>) => Promise<any>;
export type ServerSideProps = ({ req }: { req: NextApiRequest }) => Promise<any>;

export function validSessionToken(token: string): boolean {
  //authenticate the session
  var output: boolean = false;
  client.sessions
    .authenticate({ session_token: token })
    .then((sessionAuthResp) => {
      if (sessionAuthResp.status_code != BigInt(200)) {
        output = false;
      }
      output = true;
    })
    .catch((err) => {
      console.error('Failed to validate session. Token = ', token, err);
      output = false;
    });
  return output;
}
