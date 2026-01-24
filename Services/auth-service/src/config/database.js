import { Sequelize } from 'sequelize';
import config from './environment.js';

export const sequelize = new Sequelize({
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.password,
  database: config.database.database,
  dialect: config.database.dialect,
  logging: config.database.logging,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('[DB] MySQL connection established successfully');
    return true;
  } catch (error) {
    console.error('[DB] Unable to connect to MySQL:', error);
    return false;
  }
};

export const syncDatabase = async (alter = false) => {
  try {
    await sequelize.sync({ alter });
    console.log('[DB] Database synchronized');
    return true;
  } catch (error) {
    console.error('[DB] Database sync error:', error);
    return false;
  }
};

export default sequelize;
