import Joi from 'joi';

export const REFRESH_TOKEN_COLLECTION_NAME = 'refreshTokens';

export const REFRESH_TOKEN_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().required(),
  token: Joi.string().required(),
  expiresAt: Joi.date().required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
});

// Validate trước khi tạo - chỉ validation thôi
export const validateBeforeCreate = async (data) => {
  return await REFRESH_TOKEN_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};
