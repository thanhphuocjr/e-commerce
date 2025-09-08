// src/repositories/userRepository.js
import { ObjectId } from 'mongodb';
import crypto from 'crypto';
import { GET_DB } from '~/config/mongodb';
import AppError from '~/utils/AppError';
import {
  USER_COLLECTION_NAME,
  validateBeforeCreate,
  hashPassword,
} from '~/models/userModel';

// Create new user
export const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    validData.password = await hashPassword(validData.password);
    const createdUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .insertOne(validData);
    return createdUser;
  } catch (error) {
    throw new AppError('createNew in Repository has problems', 500, error);
  }
};


// Find user by email
export const findOneByEmail = async (email) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email });
  } catch (error) {
    throw new AppError('findOneByEmail has problems', 500, error);
  }
};

// Find user by ID
export const findOneById = async (id) => {
  try {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
  } catch (error) {
    throw new AppError('findOneById has problems', 500, error);
  }
};

// Get stats
export const getStats = async () => {
  try {
    const collection = GET_DB().collection(USER_COLLECTION_NAME);
    const [total, active, inactive, blocked] = await Promise.all([
      collection.countDocuments(),
      collection.countDocuments({ status: 'active' }),
      collection.countDocuments({ status: 'inactive' }),
      collection.countDocuments({ status: 'blocked' }),
    ]);
    return { total, active, inactive, blocked };
  } catch (error) {
    throw new AppError('getStats has problems', 500, error);
  }
};

// Update by ID
export const updateDataById = async (userId, updateData) => {
  try {
    updateData.updatedAt = Date.now();
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
  } catch (error) {
    throw new AppError('updateDataById has problems', 500, error);
  }
};

// Soft delete
export const softDelete = async (userId) => {
  try {
    if (!ObjectId.isValid(userId)) throw new AppError('ID không hợp lệ', 400);
    const objectId = new ObjectId(userId);
    const existingUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: objectId, _destroy: { $ne: true } });
    if (!existingUser)
      throw new AppError('Không tìm thấy user hoặc đã bị xóa', 404);
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: objectId, _destroy: { $ne: true } },
        {
          $set: {
            _destroy: true,
            deletedAt: Date.now(),
            updatedAt: Date.now(),
          },
        },
        { returnDocument: 'after' }
      );
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('softDelete has problems', 500, error);
  }
};

// Permanent delete
export const permanentDelete = async (userId) => {
  try {
    if (!ObjectId.isValid(userId)) throw new AppError('ID không hợp lệ', 400);
    const objectId = new ObjectId(userId);
    const existingUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: objectId });
    if (!existingUser) throw new AppError('Không tìm thấy user', 404);
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .deleteOne({ _id: objectId });
    if (result.deletedCount === 0)
      throw new AppError('Không thể xóa user', 400);
    return result;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('permanentDelete has problems', 500, error);
  }
};

// Restore user
export const restoreUser = async (userId) => {
  try {
    if (!ObjectId.isValid(userId)) throw new AppError('ID không hợp lệ', 400);
    const objectId = new ObjectId(userId);
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: objectId, _destroy: true },
        {
          $set: { _destroy: false, updatedAt: Date.now() },
          $unset: { deletedAt: '' },
        },
        { returnDocument: 'after' }
      );
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('restoreUser has problems', 500, error);
  }
};

// Find with filters
export const findUsersWithFilters = async ({
  page = 1,
  limit = 10,
  search,
  status,
  role,
  sortBy = 'createdAt',
  sortOrder = 'DESC',
}) => {
  const filter = {};
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (status) filter.status = status;
  if (role) filter.role = role;
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'ASC' ? 1 : -1;
  const usersCollection = GET_DB().collection(USER_COLLECTION_NAME);
  const [users, totalItems] = await Promise.all([
    usersCollection
      .find(filter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .project({ password: 0 })
      .toArray(),
    usersCollection.countDocuments(filter),
  ]);
  return {
    users,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      itemsPerPage: parseInt(limit),
    },
  };
};

// Reset password token
export const setResetPasswordToken = async (email) => {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = Date.now() + 60 * 60 * 1000;
  const result = await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .findOneAndUpdate(
      { email },
      { $set: { resetPasswordToken: token, resetPasswordExpires: expires } },
      { returnDocument: 'after' }
    );
  return { token, user: result };
};

// Find by reset token
export const findByResetToken = async (token) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
};

// Clear reset token
export const clearResetToken = async (userId) => {
  return await GET_DB()
    .collection(USER_COLLECTION_NAME)
    .updateOne(
      { _id: new ObjectId(userId) },
      { $set: { resetPasswordToken: null, resetPasswordExpires: null } }
    );
};
