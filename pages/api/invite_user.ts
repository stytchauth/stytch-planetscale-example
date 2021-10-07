import type { NextApiRequest, NextApiResponse } from 'next';
import { validSessionToken } from '../../lib/StytchSession';
import loadStytch from '../../lib/loadStytch';
import { BASE_URL } from '../../lib/constants';

type Data = {
  error: string;
  status: number;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  var token = (req.query['token'] || req.cookies[process.env.COOKIE_NAME as string]) as string;

  //validate user session
  const isValidSession = await validSessionToken(token);
  if (!isValidSession) {
    res.status(401).json({ error: 'user unauthenticated', status: 401 });
    return;
  }

  if (req.method === 'POST') {
    inviteUser(req, res);
    return;
  }
}

async function inviteUser(req: NextApiRequest, res: NextApiResponse) {
  const client = loadStytch();

  var body = JSON.parse(req.body);
  var email = body['email'];

  // params are of type stytch.InviteByEmailRequest
  const params = {
    email: email,
    login_magic_link_url: `${BASE_URL}/api/authenticate_magic_link`,
    signup_magic_link_url: `${BASE_URL}/api/authenticate_magic_link`,
  };

  try {
    await client.magicLinks.email.loginOrCreate(params);
    res.status(200);    
    
  } catch (error) {
    console.log('Failed invite user');
    console.error(error);
    res.status(400).json({ error });
  }
  return;
}

export default handler;