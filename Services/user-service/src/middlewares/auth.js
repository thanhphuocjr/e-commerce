// middlewares/auth.js
const jwt = require('jsonwebtoken');
const { userModel } = require('~/models/mongodb/userModel');
import AppError from '~/utils/AppError';
const asyncHandler = require('../utils/asyncHandler');
const { GET_DB } = require('../config/mongodb'); // Adjust the path as needed
const { ObjectId } = require('mongodb');

// Middleware xác thực JWT token
const authenticate = asyncHandler(async (req, res, next) => {
  //   console.log(req.headers);
  // Lấy token từ header
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
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded)
    // Kiểm tra user còn tồn tại
    const user = await GET_DB()
      .collection('users')
      .findOne({ _id: new ObjectId(decoded._id) });
    if (!user) {
      throw new AppError('Token không hợp lệ, user không tồn tại', 401);
    }

    // Kiểm tra user còn active
    if (user.status !== 'active') {
      throw new AppError('Tài khoản đã bị khóa hoặc không hoạt động', 401);
    }

    // Gán user vào request
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
const authorize = (...roles) => {
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

module.exports = {
  authenticate,
  authorize,
};
