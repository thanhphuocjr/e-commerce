// thanhphuocjr
// 0ubZbJSbFBX7RzAy

import { env } from './environment';
import { MongoClient, ServerApiVersion } from 'mongodb';

let ecomDatabaseInstance = null;

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const CONNECT_DB = async () => {
  await mongoClientInstance.connect();
  ecomDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME);
};

export const CLOSE_DB = async () => {
  await mongoClientInstance.close();
};

export const GET_DB = () => {
  if (!ecomDatabaseInstance) throw new Error('Must connect to Database first');
  return ecomDatabaseInstance;
};
