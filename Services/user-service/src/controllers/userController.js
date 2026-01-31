import AppError from '../utils/AppError.js';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../utils/asyncHandler.js';
import userService from '../services/userService.js';
class UserController {
  register = asyncHandler(async (req, res) => {
    const userData = req.body;

    //result for service floor
    const result = await userService.register(userData);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Create account successfully!',
      data: result,
    });
  });

  //Login
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await userService.login(email, password);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Login account successfully!',
      data: result,
    });
  });

  getProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await userService.getProfile(userId);

    res.status(200).json({
      success: true,
      message: 'Lấy profile thành công!',
      data: result,
    });
  });

  changePassword = asyncHandler(async (req, res) => {
    const userId = req.user.id.toString();
    const updateData = req.body;

    const { currentPassword, newPassword } = req.body;
    const result = await userService.changePassword(
      userId,
      currentPassword,
      newPassword,
    );
    res.status(200).json({
      success: true,
      message: 'Cap nhat mat khau thanh cong!',
      data: result,
    });
  });

  getUsersList = asyncHandler(async (req, res) => {
    const queryParams = req.query;
    const result = await userService.getUsersList(queryParams);

    res.status(200).json({
      success: true,
      message: 'Get UserList successfully!',
      data: result,
    });
  });

  createUser = asyncHandler(async (req, res) => {
    const userData = req.body;
    // console.log(userData);
    // email: 'phuoc@example.com',
    // password: 'Anhphuoc123@',
    // fullName: 'Thành Phước',
    // role: 'user',
    // status: 'active'

    const result = await userService.createUser(userData);
    res.status(201).json({
      success: true,
      message: 'Tạo user thành công',
      data: result,
    });
  });

  getStats = asyncHandler(async (req, res) => {
    const stats = await userService.getUserStats();

    res.status(200).json({
      success: true,
      message: 'Lấy thống kê users thành công',
      data: stats,
    });
  });

  getUserById = asyncHandler(async (req, res) => {
    const idUser = req.params.id;
    const result = await userService.getUserById(idUser);

    res.status(200).json({
      success: true,
      message: 'Lấy Thong tin user thanh cong!',
      data: result,
    });
  });

  updateUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;

    const result = await userService.updateUser(id, updateData);
    res.status(200).json({
      success: true,
      message: 'Cap nhat thong tin user thanh cong!',
      data: result,
    });
  });

  deleteUser = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const currentUserId = req.user.id.toString();

    if (id === currentUserId) {
      throw new AppError('Không thể xoá chính mình', 400);
    }

    const result = await userService.deleteUser(id);
    res.status(200).json({
      success: true,
      message: 'Xoa thong tin User thanh cong!',
      data: result,
    });
  });

  async restoreUser(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new AppError('User ID is required', 400);
      }

      const result = await userService.restoreUser(id);

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: 'User restored successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  permanentDeleteUser = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const currentUserId = req.user.id.toString();

    if (id === currentUserId) {
      throw new AppError('Không thể xoá chính mình', 400);
    }

    const result = await userService.permanentDeleteUser(id);
    res.status(200).json({
      success: true,
      message: 'Xoa thong tin VINH VIEN thanh cong!',
      data: result,
    });
  });

  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await userService.forgotPassword(email);
    res.status(StatusCodes.OK).json({ success: true, ...result });
  });

  resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;
    const result = await userService.resetPassword(token, newPassword);
    res.status(StatusCodes.OK).json({ success: true, ...result });
  });

  getInternalUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await userService.getInternalUserById(id);
    res.status(200).json({
      success: true,
      data: user,
    });
  });
}

export default new UserController();
