/* eslint-disable semi */
/* eslint-disable no-console */
import express from 'express';
import exitHook from 'async-exit-hook';
import { CLOSE_DB, CONNECT_DB, GET_DB } from './config/mongodb';
import { env } from './config/environment';
import { APIs_V1 } from '~/routes/v1';
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js';
import cors from 'cors';

const START_SERVER = () => {
  const app = express();

  //Enable req.body json data
  app.use(cors());

  app.use(express.json());

  //Use APIs V1
  app.use('/v1', APIs_V1);

  //Handle errors
  app.use(errorHandlingMiddleware);

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`🚀 Server running on port: ${env.APP_PORT}`);
    console.log(
      `3.Hello ${env.AUTHOR} Dev, I am running at http://${env.APP_HOST}:${env.APP_PORT}/`
    );
  });

  exitHook(() => {
    console.log('4.Server is shutting down...');
    CLOSE_DB();
    console.log('5.Disconnecting from MongoDB Cloud Atlas!');
  });
};

(async () => {
  try {
    console.log('1.Connecting to MongoDB Cloud Atlas!');
    await CONNECT_DB();
    console.log('2.Connected to MongoDB Cloud Atlas!');
    START_SERVER();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();
