// src/repositories/mongodb/userRepositoryMongo.js
import { ObjectId } from 'mongodb';
import crypto from 'crypto';
import { GET_DB } from '../../../config/mongodb.js';
import AppError from '../../../utils/AppError.js';
import {
  USER_COLLECTION_NAME,
  validateBeforeCreate,
  hashPassword,
  comparePassword,
} from '../../../models/mongodb/userModel.js';
import { UserRepositoryInterface } from '../userRepositoryInterface.js';

export class UserRepositoryMongo extends UserRepositoryInterface {
  // Create new user
  async createNew(data) {
    try {
      const validData = await validateBeforeCreate(data);
      validData.password = await hashPassword(validData.password);
      const createdUser = await GET_DB()
        .collection(USER_COLLECTION_NAME)
        .insertOne(validData);
      return { _id: createdUser.insertedId, ...validData };
    } catch (error) {
      throw new AppError('createNew in Repository has problems', 500, error);
    }
  }

  // Find user by email
  async findOneByEmail(email) {
    try {
      return await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email });
    } catch (error) {
      throw new AppError('findOneByEmail has problems', 500, error);
    }
  }

  // Find user by ID
  async findOneById(id) {
    try {
      return await GET_DB()
        .collection(USER_COLLECTION_NAME)
        .findOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw new AppError('findOneById has problems', 500, error);
    }
  }

  // Get stats
  async getStats() {
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
  }

  // Update by ID
  async updateDataById(userId, updateData) {
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
          { returnDocument: 'after' },
        );
    } catch (error) {
      throw new AppError('updateDataById has problems', 500, error);
    }
  }

  // Soft delete
  async softDelete(userId) {
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
          { returnDocument: 'after' },
        );
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('softDelete has problems', 500, error);
    }
  }

  // Permanent delete
  async permanentDelete(userId) {
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
  }

  // Restore user
  async restoreUser(userId) {
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
          { returnDocument: 'after' },
        );
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('restoreUser has problems', 500, error);
    }
  }

  // Find with filters
  // Find with filters
  async findUsersWithFilters({
    page = 1,
    limit = 10,
    fullName,
    email,
    phone,
    status,
    role,
    sort = '',
    ...otherFilters
  }) {
    const filter = {};

    // Lọc theo từng field riêng
    if (fullName) filter.fullName = { $regex: fullName, $options: 'i' };
    if (email) filter.email = { $regex: email, $options: 'i' };
    if (phone) filter.phone = { $regex: phone, $options: 'i' };
    if (status) filter.status = status;
    if (role) filter.role = role;

    // Filter động (VD: _destroy=false, deletedAt=null)
    Object.keys(otherFilters).forEach((key) => {
      if (otherFilters[key] !== undefined) {
        filter[key] = otherFilters[key];
      }
    });

    // Parse sort string thành object Mongo
    let sortOptions = {};
    if (sort) {
      sort.split(',').forEach((field) => {
        const [key, order] = field.split(':');
        if (key) {
          const cleanOrder = order?.trim().toUpperCase();
          sortOptions[key.trim()] = cleanOrder === 'ASC' ? 1 : -1;
        }
      });
    } else {
      sortOptions = { createdAt: -1 };
    }

    const usersCollection = GET_DB().collection(USER_COLLECTION_NAME);

    const [users, totalItems] = await Promise.all([
      usersCollection
        .find(filter)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .project({ password: 0 }) // ẩn password
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
  }

  // Reset password token
  async setResetPasswordToken(email) {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 60 * 60 * 1000;
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { email },
        { $set: { resetPasswordToken: token, resetPasswordExpires: expires } },
        { returnDocument: 'after' },
      );
    return { token, user: result };
  }

  // Find by reset token
  async findByResetToken(token) {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
  }

  // Clear reset token
  async clearResetToken(userId) {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(userId) },
        { $set: { resetPasswordToken: null, resetPasswordExpires: null } },
      );
  }
  async setActiveStatus(id) {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { status: 'active' } },
        { returnDocument: 'after' },
      );
  }
  async setInActiveStatus(id) {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { status: 'inactive' } },
        { returnDocument: 'after' },
      );
  }
}
