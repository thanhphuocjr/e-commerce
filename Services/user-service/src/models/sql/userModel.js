// src/models/sql/userModel.js
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import Joi from 'joi';

// Validation schema
export const USER_VALIDATION_SCHEMA = Joi.object({
  email: Joi.string().email().required().trim().strict(),
  password: Joi.string().min(6).max(100).required(),
  fullName: Joi.string().min(2).max(100).required().trim().strict(),
  phone: Joi.string().allow(null),
  avatar: Joi.string().allow(null),
  role: Joi.string().valid('admin', 'user').default('user'),
  status: Joi.string()
    .valid('active', 'inactive', 'blocked')
    .default('inactive'),
  lastLogin: Joi.date().allow(null),
  resetPasswordToken: Joi.string().allow(null),
  resetPasswordExpires: Joi.date().allow(null),
  deletedAt: Joi.date().allow(null),
  isDestroyed: Joi.boolean().default(false),
});

// Validate trước khi tạo user
export const validateBeforeCreate = async (data) => {
  return await USER_VALIDATION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

// Hash password
export const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainPassword, salt);
};

// Compare password
export const comparePassword = async (candidatePassword, hashedPassword) => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

// Generate UUID
export const generateUserId = () => {
  return uuidv4();
};
