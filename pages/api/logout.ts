import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { STYTCH_SESSION_NAME } from '../../lib/constants';

type Data = {
  error?: string;
  message?: string;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    try {
      //  you can add logic to destroy other sessions or cookies as well
      res
        .status(200)
        .setHeader('Set-Cookie', [
          serialize(process.env.COOKIE_NAME as string, '', { path: '/', maxAge: -1 }),
          serialize(STYTCH_SESSION_NAME, '', { path: '/', maxAge: -1 }),
        ])
        .json({ message: 'logged out' });
    } catch (error) {
      res.status(400).json({ error });
    }
    return;
  }
}

export default handler;
