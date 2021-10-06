import loadStytch from './loadStytch';

const client = loadStytch();

export async function validSessionToken(token: string): Promise<boolean> {
  //authenticate the session

  try {
    const sessionAuthResp = await client.sessions.authenticate({ session_token: token });

    if (sessionAuthResp.status_code != BigInt(200)) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to validate session. Token = ', token);
    console.log(error);
    return false;
  }
}
