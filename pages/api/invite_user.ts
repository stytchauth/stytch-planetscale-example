import type { NextApiRequest, NextApiResponse } from 'next';
import { validSessionToken } from '../../lib/StytchSession';
import loadStytch from '../../lib/loadStytch';
import Router from 'next/router';

type Data = {
  error: string;
};

export async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  var token = (req.query['token'] || req.cookies[process.env.COOKIE_NAME as string]) as string;
  if (!validSessionToken(token)) {
    res.redirect('/');
    return;
  }

  if (req.method === 'POST') {
    inviteUser(req, res);
    return;
  }
}

function inviteUser(req: NextApiRequest, res: NextApiResponse) {
  const client = loadStytch();

  var body = JSON.parse(req.body);
  var email = body['email'];

  // params are of type stytch.InviteByEmailRequest
  const params = {
    email: email,
    login_magic_link_url: `http://localhost:3000/api/authenticate_magic_link`,
    signup_magic_link_url: `http://localhost:3000/api/authenticate_magic_link`,
  };

  client.magicLinks.email
    .loginOrCreate(params)
    .then((resp) => {
      res.status(200).json({ message: 'success' });
    })
    .catch((error) => {
      console.error('Failed invite user');
      res.status(400).json({ error });
    });
  return;
}

export default handler;