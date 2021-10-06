// This API route logs a user out.
import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

type Data = {
  error: string;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    try {

      // Set session
      res.setHeader('Set-Cookie', serialize(process.env.COOKIE_NAME as string, '', { path: '/', maxAge: -1 }));
      res.redirect('/');
      
    } catch (error) {
      res.status(400).json({ error });
    }
  } else {
    // Handle any other HTTP method
  }
}

export default handler;
