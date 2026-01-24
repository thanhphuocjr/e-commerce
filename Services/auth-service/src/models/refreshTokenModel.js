import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/database.js';

/**
 * RefreshToken Model
 * Schema:
 * - id: UUID primary key
 * - userId: MongoDB ObjectId string (from User Service)
 * - token: Refresh token string
 * - expiresAt: Token expiration timestamp
 * - createdAt: Created timestamp
 * - updatedAt: Updated timestamp
 * - isRevoked: Soft delete flag for logout
 */
const RefreshToken = sequelize.define(
  'RefreshToken',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'MongoDB ObjectId from User Service',
      index: true,
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      comment: 'Refresh token hash',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Token expiration time',
    },
    isRevoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Soft delete - for logout',
    },
    createdAt: {
      type: DataTypes.BIGINT,
      defaultValue: () => Date.now(),
      comment: 'Timestamp in milliseconds',
    },
    updatedAt: {
      type: DataTypes.BIGINT,
      defaultValue: () => Date.now(),
      onUpdate: () => Date.now(),
      comment: 'Timestamp in milliseconds',
    },
  },
  {
    tableName: 'refresh_tokens',
    timestamps: false, // Sequelize timestamps - we manage manually
    indexes: [
      {
        fields: ['userId'],
        name: 'idx_user_id',
      },
      {
        fields: ['token'],
        name: 'idx_token',
      },
      {
        fields: ['expiresAt'],
        name: 'idx_expires_at',
      },
    ],
  },
);

export default RefreshToken;
