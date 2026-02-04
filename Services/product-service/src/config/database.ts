import mysql from 'mysql2/promise';
import config from './environment.js';

let pool: any;

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

export const createTables = async () => {
  const connection = await mysql.createConnection({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
  });

  try {
    console.log('[DB] Creating tables...');

    // 1. Create Categories table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('[DB] ✓ Table "categories" created');

    // 2. Create Brands table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS brands (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('[DB] ✓ Table "brands" created');

    // 3. Create Products table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category_id INT NOT NULL,
        brand_id INT,
        price DECIMAL(10, 2) NOT NULL,
        discount_percentage DECIMAL(5, 2) DEFAULT 0,
        rating DECIMAL(3, 2) DEFAULT 0,
        stock INT DEFAULT 0,
        sku VARCHAR(50) UNIQUE,
        weight DECIMAL(8, 2),
        width DECIMAL(8, 2),
        height DECIMAL(8, 2),
        depth DECIMAL(8, 2),
        warranty_information VARCHAR(255),
        shipping_information VARCHAR(255),
        availability_status VARCHAR(50),
        return_policy VARCHAR(255),
        minimum_order_quantity INT DEFAULT 1,
        barcode VARCHAR(50),
        qr_code VARCHAR(255),
        thumbnail VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
        FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
        
        INDEX idx_category (category_id),
        INDEX idx_brand (brand_id),
        INDEX idx_price (price),
        INDEX idx_rating (rating),
        INDEX idx_sku (sku),
        INDEX idx_availability (availability_status),
        FULLTEXT INDEX idx_search (title, description)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('[DB] ✓ Table "products" created');

    // 4. Create Reviews table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        review_date TIMESTAMP NOT NULL,
        reviewer_name VARCHAR(100),
        reviewer_email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        
        INDEX idx_product (product_id),
        INDEX idx_rating (rating),
        INDEX idx_date (review_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('[DB] ✓ Table "reviews" created');

    // 5. Create Tags table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS tags (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        INDEX idx_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('[DB] ✓ Table "tags" created');

    // 6. Create Product_Tags junction table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS product_tags (
        product_id INT NOT NULL,
        tag_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        PRIMARY KEY (product_id, tag_id),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
        
        INDEX idx_tag (tag_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('[DB] ✓ Table "product_tags" created');

    // 7. Create Product_Images table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS product_images (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        
        INDEX idx_product (product_id),
        INDEX idx_order (product_id, display_order)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('[DB] ✓ Table "product_images" created');

    console.log('[DB] All tables created successfully');
  } catch (error) {
    console.error('[DB] Error creating tables:', error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const dropTables = async () => {
  const connection = await mysql.createConnection({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
  });

  try {
    console.log('[DB] Dropping tables...');

    // Disable foreign key checks temporarily
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

    await connection.execute('DROP TABLE IF EXISTS product_images');
    await connection.execute('DROP TABLE IF EXISTS product_tags');
    await connection.execute('DROP TABLE IF EXISTS reviews');
    await connection.execute('DROP TABLE IF EXISTS tags');
    await connection.execute('DROP TABLE IF EXISTS products');
    await connection.execute('DROP TABLE IF EXISTS brands');
    await connection.execute('DROP TABLE IF EXISTS categories');

    // Re-enable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    console.log('[DB] All tables dropped successfully');
  } catch (error) {
    console.error('[DB] Error dropping tables:', error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const getPool = () => {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initDatabase first.');
  }
  return pool;
};

export const closePool = async () => {
  if (pool) {
    await pool.end();
    console.log('[DB] Connection pool closed');
  }
};

export const runMigrations = async () => {
  try {
    await createDatabase();
    await createTables();
    console.log('[DB] Migrations completed successfully');
  } catch (error) {
    console.error('[DB] Migration failed:', error);
    throw error;
  }
};

// runMigrations();
