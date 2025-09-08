import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { userRoute } from './userRoute';

const Router = express.Router();

Router.get('/status', (req, res) => {
  res
    .status(StatusCodes.OK)
    .json({ message: 'APIs v1 are ready to use', statusCode: StatusCodes.OK });
});

Router.use('/users', userRoute);

export const APIs_V1 = Router;
