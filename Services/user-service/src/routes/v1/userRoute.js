import express from 'express';
import { StatusCodes } from 'http-status-codes';
import userValidation from '../../validations/userValidation.js';
import validate from '../../middlewares/validation.js';
import { authenticate, authorize } from '../../middlewares/auth.js';
import userController from '../../controllers/userController.js';
const Router = express.Router();

Router.get('/register', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'Register Route is ready' });
});

Router.post(
  '/register',
  validate(userValidation.register),
  userController.register,
);

Router.post(
  '/forgot-password',
  validate(userValidation.forgotPassword),
  userController.forgotPassword,
);

Router.post(
  '/reset-password',
  validate(userValidation.resetPassword),
  userController.resetPassword,
);

Router.post('/login', validate(userValidation.login), userController.login);

//protected routes (login)
Router.use(authenticate); // Can xac thuc truoc khi vao,

Router.get('/profile', userController.getProfile);

Router.patch(
  '/change-password',
  validate(userValidation.changePassword),
  userController.changePassword,
);

//Admin route
Router.use(authorize('admin'));

Router.get(
  '/',
  validate(userValidation.getUsersList),
  userController.getUsersList,
);

Router.post(
  '/',
  validate(userValidation.createUser),
  userController.createUser,
);

Router.get('/stats', userController.getStats);

Router.get(
  '/:id',
  validate(userValidation.getUserById),
  userController.getUserById,
);

Router.patch(
  '/:id',
  validate(userValidation.updateUser),
  userController.updateUser,
);

Router.delete(
  '/:id',
  validate(userValidation.getUserById), //Dung lai dua phan getUserById
  userController.deleteUser,
);

Router.delete(
  '/permanent/:id',
  validate(userValidation.getUserById),
  userController.permanentDeleteUser,
);

Router.patch(
  '/restore/:id',
  validate(userValidation.getUserById),
  userController.restoreUser,
);
export const userRoute = Router;
