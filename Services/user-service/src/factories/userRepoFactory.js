// src/repositories/userRepoFactory.js
import { env } from '../config/environment.js';
import { UserRepositoryMongo } from '../repositories/user/mongodb/userRepositoryMongo.js';
import { UserRepositorySQL } from '../repositories/user/sql/userRepositorySQL.js';

let instance;

export function getUserRepository() {
  if (!instance) {
    const dbType = env.DATABASE_TYPE;
    switch (dbType) {
      case 'mongodb':
        instance = new UserRepositoryMongo();
        console.log('[Factory] Using MongoDB repository');
        break;
      case 'sql':
        instance = new UserRepositorySQL();
        console.log('[Factory] Using SQL repository');
        break;
      default:
        throw new Error(`Unsupported DB type: ${dbType}`);
    }
  }
  return instance;
}
