import type { NextApiRequest, NextApiResponse } from 'next';
import { validSessionToken } from '../../../lib/StytchSession';
import mysql from 'mysql2';
import { OkPacket } from 'mysql2';

const URL = process.env.DATABASE_URL as string;
const sqlConn = mysql.createConnection(URL);
sqlConn.connect();

export interface User {
  id: number;
  email: string;
  name: string;
}

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  var token = (req.query['token'] || req.cookies[process.env.COOKIE_NAME as string]) as string;

  //validate session
  var isValidSession = await validSessionToken(token);
  if (!isValidSession) {
    res.status(401).json({ error: 'user unauthenticated' });
    return;
  }

  if (req.method === 'GET') {
    getUsers(req, res);
  } else if (req.method === 'POST') {
    addUser(req, res);
  }
  return;
}

//getUsers retrieve all users
async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    var query = 'select * from users';

    var users;
    const result = await sqlConn
      .promise()
      .query(query)
      .then(([rows]) => {
        users = rows;
      });

    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'an error occurred' });
  }
  return;
}

//addUser create a new user
async function addUser(req: NextApiRequest, res: NextApiResponse) {
  var user = JSON.parse(req.body);
  var email = user.email;
  var name = user.name;

  try {
    var query = 'INSERT INTO users (name, email) VALUES (?,?)';
    var params = [name, email];

    var insertID;
    const result = sqlConn.query(query, params, (err, result) => {
      if (err) {
        throw err;
      }

      insertID = (<OkPacket>result).insertId;
    });

    res.status(201).json({ id: insertID });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'an error occurred' });
  }
  return;
}

export default handler;
