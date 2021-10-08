import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

type Data = {
  error?: string;
  status: number;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    try {
      //  you can add logic to destroy other sessions or cookies as well
      res
        .status(200)
        .setHeader('Set-Cookie', serialize(process.env.COOKIE_NAME as string, '', { path: '/', maxAge: -1 }))
        .json({ status: 200 });
    } catch (error) {
      res.status(400).json({ error: error as string, status: 400 });
    }
  }
}

export default handler;
