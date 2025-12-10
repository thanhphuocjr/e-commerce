// src/repositories/sql/userRepositorySQL.js
import { UserRepositoryInterface } from '../userRepositoryInterface';
import db from '~/models/mongodb/userModel'; // Sequelize models
import AppError from '~/utils/AppError';

export class UserRepositorySQL extends UserRepositoryInterface {
  async createNew(data) {
    try {
      return await db.User.create(data);
    } catch (error) {
      throw new AppError('createNew SQL error', 500, error);
    }
  }

  async findOneByEmail(email) {
    return await db.User.findOne({ where: { email } });
  }

  async findOneById(id) {
    return await db.User.findByPk(id);
  }

  // … các method khác implement tương tự
}
