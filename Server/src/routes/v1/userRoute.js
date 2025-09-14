import express from 'express';
import { StatusCodes } from 'http-status-codes';
import userValidation from '~/validations/userValidation';
import validate from '~/middlewares/validation';
import { authenticate, authorize } from '~/middlewares/auth';
import userController from '~/controllers/userController';
const Router = express.Router();

Router.get('/register', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'Register Route is ready' });
});

Router.post(
  '/register',
  validate(userValidation.register),
  userController.register
);

Router.post(
  '/forgot-password',
  validate(userValidation.forgotPassword),
  userController.forgotPassword
);

Router.post(
  '/reset-password',
  validate(userValidation.resetPassword),
  userController.resetPassword
);

Router.post('/login', validate(userValidation.login), userController.login);

//Token
Router.post(
  '/refresh',
  validate(userValidation.refreshToken),
  userController.refreshToken
);

Router.post('/logout', validate(userValidation.logout), userController.logout);

//protected routes (login)
Router.use(authenticate); // Can xac thuc truoc khi vao,

Router.get('/profile', userController.getProfile);

Router.patch(
  '/change-password',
  validate(userValidation.changePassword),
  userController.changePassword
);
Router.post('/logout-all', userController.logoutAllDevices);

//Admin route
Router.use(authorize('admin'));

Router.get('/', validate(userValidation.getUsersList), userController.getUsers);

Router.post(
  '/',
  validate(userValidation.createUser),
  userController.createUser
);

Router.get('/stats', userController.getStats);

Router.get(
  '/:id',
  validate(userValidation.getUserById),
  userController.getUserById
);

Router.patch(
  '/:id',
  validate(userValidation.updateUser),
  userController.updateUser
);

Router.delete(
  '/:id',
  validate(userValidation.getUserById), //Dung lai dua phan getUserById
  userController.deleteUser
);

Router.delete(
  '/permanent/:id',
  validate(userValidation.getUserById),
  userController.permanentDeleteUser
);

Router.patch(
  '/restore/:id',
  validate(userValidation.getUserById),
  userController.restoreUser
);
export const userRoute = Router;
