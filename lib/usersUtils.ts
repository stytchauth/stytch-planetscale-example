export const signOut = async () => {
  const resp = await fetch('/api/logout', { method: 'POST' });
  return resp;
};
