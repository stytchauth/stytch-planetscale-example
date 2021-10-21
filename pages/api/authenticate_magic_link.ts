import type { NextApiRequest, NextApiResponse } from 'next';
import loadStytch from '../../lib/loadStytch';
import { serialize } from 'cookie';

type Data = {
  error: string;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    authenticate(req, res);
    return;
  }
}

async function authenticate(req: NextApiRequest, res: NextApiResponse) {
  const client = loadStytch();
  const { token } = req.query;

  try {
    //authenticate request and create 1 hour session
    const resp = await client.magicLinks.authenticate(token as string, { session_duration_minutes: 60 });

    //send user to profile with cookies in response
    res.setHeader(
      'Set-Cookie',
      serialize(process.env.COOKIE_NAME as string, resp.session_token as string, { path: '/' }),
    );
    res.redirect('/profile');
    return;
  } catch (error) {
    res.status(400).json({ error });
    return;
  }
}

export default handler;
