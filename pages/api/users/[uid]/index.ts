import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2';
import { OkPacket } from 'mysql2';
import { validSessionToken } from '../../../../lib/StytchSession';

const URL = process.env.DATABASE_URL as string;
const sqlConn = mysql.createConnection(URL);
sqlConn.connect();

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  var token = (req.query['token'] || req.cookies[process.env.COOKIE_NAME as string]) as string;

  //validate session
  var isValidSession = await validSessionToken(token);
  if (!isValidSession) {
    res.status(401).json({ error: 'user unauthenticated' });
    return;
  }

  if (req.method === 'GET') {
    getUser(req, res);
  } else if (req.method === 'DELETE') {
    deleteUser(req, res);
  }
  return;
}

//getUser get a single user
async function getUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    var query = 'select * from users WHERE id=?';
    var params = [req.query['uid']];

    var user;
    const result = await sqlConn
      .promise()
      .query(query, params)
      .then(([row]) => {
        console.log(row);
        user = row;
      });

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'an error occurred' });
  }
  return;
}

//deleteUser remove a single user
async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    var query = 'DELETE from users WHERE id=?';
    var params = [req.query['uid']];

    var status = 200;

    const result = await sqlConn
      .promise()
      .query(query, params)
      .then(([row]) => {
        if ((<OkPacket>row).affectedRows == 0) {
          status = 304;
        }
      });

    res.status(status).json({ message: 'success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'an error occurred' });
  }
  return;
}

export default handler;
