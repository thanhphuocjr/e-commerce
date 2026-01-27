/* eslint-disable semi */
/* eslint-disable no-console */
import express from 'express';
import exitHook from 'async-exit-hook';
import { CLOSE_DB, CONNECT_DB, GET_DB } from './config/mongodb.js';
import { env } from './config/environment.js';
import { APIs_V1 } from './routes/v1/index.js';
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js';
import cors from 'cors';
import * as mysqlDB from './config/mysql.js';

const START_SERVER = () => {
  const app = express();

  //Enable req.body json data
  app.use(cors());

  app.use(express.json());

  //Use APIs V1
  app.use('/v1', APIs_V1);

  //Handle errors
  app.use(errorHandlingMiddleware);

  app.listen(env.APP_PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port: ${env.APP_PORT}`);
    console.log(
      `3.Hello ${env.AUTHOR} Dev, userService are running at http://${env.APP_HOST}:${env.APP_PORT}/`,
    );
  });

  exitHook(() => {
    console.log('4.Server is shutting down...');
    if (env.DATABASE_TYPE === 'mongodb') {
      CLOSE_DB();
      console.log('5.Disconnecting from MongoDB Cloud Atlas!');
    } else if (env.DATABASE_TYPE === 'sql') {
      mysqlDB.closePool().catch((err) => {
        console.error('Error closing MySQL pool:', err);
      });
      console.log('5.Disconnecting from MySQL!');
    }
  });
};

(async () => {
  try {
    if (env.DATABASE_TYPE === 'mongodb') {
      console.log('1.Connecting to MongoDB Cloud Atlas!');
      await CONNECT_DB();
      console.log('2.Connected to MongoDB Cloud Atlas!');
      START_SERVER();
    } else if (env.DATABASE_TYPE === 'sql') {
      console.log('1.Testing MySQL connection...');
      const connected = await mysqlDB.testConnection();
      if (!connected) {
        throw new Error('Failed to connect to MySQL database');
      }

      console.log('2.Initializing MySQL database pool...');
      await mysqlDB.initDatabase();

      console.log('3.Creating database if not exists...');
      await mysqlDB.createDatabase();

      console.log('4.Creating tables...');
      await mysqlDB.createUserTable();
      await mysqlDB.createRefreshTokenTable();

      console.log('5.MySQL is ready!');
      START_SERVER();
    } else {
      throw new Error(
        `Invalid DATABASE_TYPE: ${env.DATABASE_TYPE}. Must be 'mongodb' or 'sql'`,
      );
    }
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();
