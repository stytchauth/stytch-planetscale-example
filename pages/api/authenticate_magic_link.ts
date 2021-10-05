// This API route authenticates a Stytch magic link.
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-iron-session';
// import withSession from '../../lib/withSession';
import loadStytch from '../../lib/loadStytch';

type NextIronRequest = NextApiRequest & { session: Session };

type Data = {
  error: string;
};

export async function handler(req: NextIronRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    const client = loadStytch();
    const { token } = req.query;

    try {
      //authenticate request and create 1 hour session
      const resp = await client.magicLinks.authenticate(token as string, { session_duration_minutes: 60 });

      res.redirect('/profile');
      return;
    } catch (error) {
      console.error('Failed to login user', token);
      res.status(400).json({ error });
      return;
    }
  } else {
    // Handle any other HTTP method
  }
}

export default handler;