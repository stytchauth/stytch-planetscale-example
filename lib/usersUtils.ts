
export const signOut = async () => {
  const resp = await fetch('/api/logout', { method: 'POST' });
  const data = await resp.json();
  return data;
};
