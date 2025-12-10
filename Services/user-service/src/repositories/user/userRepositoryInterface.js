// src/repositories/userRepositoryInterface.js
export class UserRepositoryInterface {
  async createNew(data) {
    throw new Error('Not implemented');
  }
  async findOneByEmail(email) {
    throw new Error('Not implemented');
  }
  async findOneById(id) {
    throw new Error('Not implemented');
  }
  async updateDataById(id, updateData) {
    throw new Error('Not implemented');
  }
  async softDelete(id) {
    throw new Error('Not implemented');
  }
  async permanentDelete(id) {
    throw new Error('Not implemented');
  }
  async restoreUser(id) {
    throw new Error('Not implemented');
  }
  async findUsersWithFilters(queryParams) {
    throw new Error('Not implemented');
  }
  async getStats() {
    throw new Error('Not implemented');
  }
  async setResetPasswordToken(email) {
    throw new Error('Not implemented');
  }
  async findByResetToken(token) {
    throw new Error('Not implemented');
  }
  async clearResetToken(id) {
    throw new Error('Not implemented');
  }
  async setActiveStatus(id) {
    throw new Error('Not implemented!');
  }
  async setInActiveStatus(id) {
    throw new Error('Not implemented!');
  }
}
