// middlewares/auth.js
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { GET_DB } from '../config/mongodb.js';

// Middleware xác thực JWT
export const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Vui lòng đăng nhập để truy cập', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await GET_DB()
      .collection('users')
      .findOne({ _id: new ObjectId(decoded._id) });

    if (!user) {
      throw new AppError('Token không hợp lệ, user không tồn tại', 401);
    }

    if (user.status !== 'active') {
      throw new AppError('Tài khoản đã bị khóa hoặc không hoạt động', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Token không hợp lệ', 401);
    }
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token đã hết hạn', 401);
    }
    throw error;
  }
});

// Middleware phân quyền
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError('Vui lòng đăng nhập trước', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError('Bạn không có quyền truy cập', 403);
    }

    next();
  };
};
