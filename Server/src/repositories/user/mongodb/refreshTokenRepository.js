import { GET_DB } from '~/config/mongodb';
import AppError from '~/utils/AppError';

import {
  REFRESH_TOKEN_COLLECTION_NAME,
  validateBeforeCreate,
} from '~/models/mongodb/refreshTokenModal';

export const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    validData.createdAt = Date.now();
    validData.updatedAt = Date.now();

    const result = await GET_DB()
      .collection(REFRESH_TOKEN_COLLECTION_NAME)
      .insertOne(validData);

    return { ...validData, _id: result.insertedId };
  } catch (error) {
    throw new AppError('Repository: Lỗi khi tạo refresh token', 500, error);
  }
};

// Tìm refresh token (chỉ lấy token chưa hết hạn)
export const findByToken = async (token) => {
  try {
    return await GET_DB()
      .collection(REFRESH_TOKEN_COLLECTION_NAME)
      .findOne({
        token: token,
        expiresAt: { $gt: new Date() },
      });
  } catch (error) {
    throw new AppError('Repository: Lỗi khi tìm refresh token', 500, error);
  }
};

// Xóa refresh token
export const deleteByToken = async (token) => {
  try {
    return await GET_DB()
      .collection(REFRESH_TOKEN_COLLECTION_NAME)
      .deleteOne({ token: token });
  } catch (error) {
    throw new AppError('Repository: Lỗi khi xóa refresh token', 500, error);
  }
};

// Xóa tất cả refresh token của user
export const deleteByUserId = async (userId) => {
  try {
    return await GET_DB()
      .collection(REFRESH_TOKEN_COLLECTION_NAME)
      .deleteMany({ userId: userId });
  } catch (error) {
    throw new AppError(
      'Repository: Lỗi khi xóa tất cả refresh token của user',
      500,
      error
    );
  }
};

// Cleanup expired tokens
export const deleteExpiredTokens = async () => {
  try {
    return await GET_DB()
      .collection(REFRESH_TOKEN_COLLECTION_NAME)
      .deleteMany({ expiresAt: { $lt: new Date() } });
  } catch (error) {
    throw new AppError(
      'Repository: Lỗi khi xóa refresh token hết hạn',
      500,
      error
    );
  }
};
