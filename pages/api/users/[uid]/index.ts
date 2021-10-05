import type { NextApiRequest, NextApiResponse } from 'next';
import { PSDB } from 'planetscale-node';
import { validSessionToken } from '../../../../lib/StytchSession';

const conn = new PSDB('main');
export async function handler(req: NextApiRequest, res: NextApiResponse) {
  var token = (req.query['token'] || req.cookies[process.env.COOKIE_NAME as string]) as string;
  if (!validSessionToken(token)) {
    res.status(401).json({ error: 'unauthorized' });
    console.log('failed to validate');
    return;
  }
  console.log('validated');
  if (req.method == 'GET') {
    getUser(conn, req, res);
  } else if (req.method == 'DELETE') {
    deleteUser(conn, req, res);
  }
  return;
}

//getUser get a single user
async function getUser(conn: PSDB, req: NextApiRequest, res: NextApiResponse) {
  try {
    var query = 'select * from users WHERE id=?';
    var params = [req.query['uid']];

    const [getRows, _] = await conn.query(query, params);
    res.status(200).json(getRows);
  } catch (e) {
    res.status(500).json({ error: 'an error occurred' });
  }
  return;
}

//deleteUser remove a single user
async function deleteUser(conn: PSDB, req: NextApiRequest, res: NextApiResponse) {
  try {
    var query = 'DELETE from users WHERE id=?';
    var params = [req.query['uid']];

    const [row, _] = await conn.query(query, params);
    res.status(200).json({ id: row.insertId });
  } catch (e) {
    res.status(500).json({ error: 'an error occurred' });
  }
  return;
}

export default handler;
