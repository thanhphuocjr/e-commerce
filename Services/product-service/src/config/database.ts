import mysql from 'mysql2/promise';
import config from './environment.js';

let pool;

export const initDatabase = async () => {
  try {
    pool = await mysql.createPool({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log('[DB] MySQL pool created successfully');
    return pool;
  } catch (error) {
    console.error('[DB] Failed to create connection pool:', error);
    throw error;
  }
};

export const testConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
    });

    await connection.ping();
    await connection.end();
    console.log('[DB] MySQL connection test successful');
    return true;
  } catch (error) {
    console.error(
      '[DB] MySQL connection test failed:',
      error instanceof Error ? error.message : error,
    );
    return false;
  }
};

export const createDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
    });
    const dbName = config.database.database;
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci `,
    );

    console.log(`[DB] Database '${dbName}' created or already exists`);
    await connection.end();
  } catch (error) {
    console.error(
      '[DB] Failed to create database:',
      error instanceof Error ? error.message : error,
    );
    throw error;
  }
};

