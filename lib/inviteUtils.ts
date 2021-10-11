import { BASE_URL } from './constants';
import type { NextApiResponse } from 'next';

const url = `${BASE_URL}/api/invite_user`;

var regexp = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
);


export async function inviteUser(email: string) {
   //validate email
   if (!regexp.test(email)) {
    throw new Error("email format is invalid");
  }

  const resp = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      email,
    }),
  });

  return resp;
}

export function isValidEmail(email: string) : boolean{
     //validate email
     return regexp.test(email)      
}
