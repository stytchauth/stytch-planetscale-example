import { ClassNames } from '@emotion/react';
import type {NextApiRequest, NextApiResponse} from 'next';
import { PSDB } from 'planetscale-node'
import {validSession, validSessionToken} from '../../../lib/StytchSession';
import Cookies from 'cookies';

const conn = new PSDB('main')

export interface User { 
  id: number,
  email: string, 
  password: string, 
  name: string,
 }

export async function handler(req: NextApiRequest, res: NextApiResponse){
  var token = (req.query["token"] || req.cookies[process.env.COOKIE_NAME as string]) as string
  if (!validSessionToken(token)){
    res.status(401).json({"error": "unauthorized"})
    console.log("failed to validate")
    return
  } 
  console.log("validated")

  if(req.method == 'GET'){
    getUsers(conn, req,res)
  } else if(req.method == "POST") {
    addUser(conn, req, res)
  }
  return
}

//getUsers retrieve all users
 async function getUsers(conn: PSDB, req: NextApiRequest, res: NextApiResponse)  {
  try {
    var query = 'select * from users' 

    const [getRows, _] = await conn.query(query,"")
    res.status(200).json(getRows)
    
  } catch (e) {
    res.status(500).json({"error":"an error occurred"})
  }
  return
}

//addUser create a new user
 async function addUser(conn: PSDB, req: NextApiRequest, res: NextApiResponse)  {
  var user = JSON.parse(req.body) 
  try {
    var query = "INSERT INTO users ( name, email, password) VALUES (?,?,?)"
    var params = Object.values(user)

    const [row, _] = await conn.query(query, params)
    res.status(201).json({"id": row.insertId})
  } catch (e) {
    res.status(500).json({"error":"an error occurred"})
  }
  return
}

export default handler;
