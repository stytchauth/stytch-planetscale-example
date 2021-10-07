import { BASE_URL } from './constants';
import type { NextApiResponse } from 'next';

const url = `${BASE_URL}/api/invite_user`;

var regexp = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
);


export async function inviteUser(email: string) {
   //validate email
   if (!regexp.test(email)) {
    console.error('email is invalid');
    return new Error("email format is invalid");
  }

  const resp = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      email: email,
    }),
  });

  const data = await resp.json();
  return data;
}
