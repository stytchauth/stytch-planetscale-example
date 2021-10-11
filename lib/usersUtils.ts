import { BASE_URL } from './constants';

export async function getUserById(id: number) {
  const resp = await fetch(`${BASE_URL}/api/users/${id}`, {
    method: 'GET',
  });
  const data = await resp.json();
  return data;
}

export async function deleteUserById(id: number) {
  const resp = await fetch(`${BASE_URL}/api/users/${id}`, {
    method: 'DELETE',
  });
  const data = await resp.json();
  return data;
}

export async function addUser(name: string, email: string) {
  const resp = await fetch(`${BASE_URL}/api/users`, {
    method: 'POST',
    body: JSON.stringify({
      name: name,
      email: email,
    }),
  });
  const data = await resp.json();
  return data;
}

export const getUsers = async (token: string) => {
  // we pass the token in because redirects do not immediately update the cookie
  //getUsers is the only functi being used with a redirect
  const resp = await fetch(`${BASE_URL}/api/users?token=${token}`, {
method: 'GET',
  });
  return resp;
};

export const signout = async () => {
  const resp = await fetch('/api/logout', { method: 'POST' });
  return resp;
};
