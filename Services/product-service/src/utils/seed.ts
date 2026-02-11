import mysql from 'mysql2/promise';
import config from '../config/environment.js';

const SEED_LIMIT = 300;

interface DummyProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images: string[];
  thumbnail: string;
}

interface DummyJsonResponse {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
}

export const fetchProductsFromAPI = async (
  limit: number = SEED_LIMIT,
): Promise<DummyProduct[]> => {
  try {
    console.log(
      `[SEED] Fetching products from DummyJSON API (limit: ${limit})...`,
    );
    const response = await fetch(
      `https://dummyjson.com/products?limit=${limit}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: DummyJsonResponse = await response.json();
    console.log(`[SEED] ✓ Fetched ${data.products.length} products`);
    return data.products;
  } catch (error) {
    console.error('[SEED] Error fetching products:', error);
    throw error;
  }
};

export const seedDatabase = async () => {
  const connection = await mysql.createConnection({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
  });

  try {
    console.log('[SEED] Starting database seeding...');

    // Fetch products from API
    const products = await fetchProductsFromAPI(SEED_LIMIT);

    // Start transaction
    await connection.beginTransaction();

    // Extract unique categories and brands
    const categoriesSet = new Set<string>();
    const brandsSet = new Set<string>();
    const tagsSet = new Set<string>();

    products.forEach((product) => {
      categoriesSet.add(product.category);
      if (product.brand) brandsSet.add(product.brand);
      product.tags.forEach((tag) => tagsSet.add(tag));
    });

    console.log(`[SEED] Found ${categoriesSet.size} unique categories`);
    console.log(`[SEED] Found ${brandsSet.size} unique brands`);
    console.log(`[SEED] Found ${tagsSet.size} unique tags`);

    // Insert categories
    console.log('[SEED] Inserting categories...');
    const categoryMap = new Map<string, number>();
    for (const category of categoriesSet) {
      const [result]: any = await connection.execute(
        'INSERT INTO categories (name) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
        [category],
      );
      const categoryId =
        result.insertId || (await getCategoryId(connection, category));
      categoryMap.set(category, categoryId);
    }
    console.log(`[SEED] ✓ Inserted ${categoriesSet.size} categories`);

    // Insert brands
    console.log('[SEED] Inserting brands...');
    const brandMap = new Map<string, number>();
    for (const brand of brandsSet) {
      const [result]: any = await connection.execute(
        'INSERT INTO brands (name) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
        [brand],
      );
      const brandId = result.insertId || (await getBrandId(connection, brand));
      brandMap.set(brand, brandId);
    }
    console.log(`[SEED] ✓ Inserted ${brandsSet.size} brands`);

    // Insert tags
    console.log('[SEED] Inserting tags...');
    const tagMap = new Map<string, number>();
    for (const tag of tagsSet) {
      const [result]: any = await connection.execute(
        'INSERT INTO tags (name) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
        [tag],
      );
      const tagId = result.insertId || (await getTagId(connection, tag));
      tagMap.set(tag, tagId);
    }
    console.log(`[SEED] ✓ Inserted ${tagsSet.size} tags`);

    // Insert products
    console.log('[SEED] Inserting products...');
    let productCount = 0;
    let reviewCount = 0;
    let imageCount = 0;

    for (const product of products) {
      const categoryId = categoryMap.get(product.category);
      const brandId = product.brand ? brandMap.get(product.brand) : null;

      // Insert product
      const [productResult]: any = await connection.execute(
        `INSERT INTO products (
          title, description, category_id, brand_id, price, 
          discount_percentage, rating, stock, sku, weight, 
          width, height, depth, warranty_information, 
          shipping_information, availability_status, return_policy,
          minimum_order_quantity, barcode, qr_code, thumbnail,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.title,
          product.description,
          categoryId,
          brandId,
          product.price,
          product.discountPercentage,
          product.rating,
          product.stock,
          product.sku,
          product.weight,
          product.dimensions.width,
          product.dimensions.height,
          product.dimensions.depth,
          product.warrantyInformation,
          product.shippingInformation,
          product.availabilityStatus,
          product.returnPolicy,
          product.minimumOrderQuantity,
          product.meta.barcode,
          product.meta.qrCode,
          product.thumbnail,
          convertToMySQLDateTime(product.meta.createdAt),
          convertToMySQLDateTime(product.meta.updatedAt),
        ],
      );

      const productId = productResult.insertId;
      productCount++;

      // Insert product tags
      for (const tag of product.tags) {
        const tagId = tagMap.get(tag);
        await connection.execute(
          'INSERT INTO product_tags (product_id, tag_id) VALUES (?, ?)',
          [productId, tagId],
        );
      }

      // Insert product images
      for (let i = 0; i < product.images.length; i++) {
        await connection.execute(
          'INSERT INTO product_images (product_id, image_url, display_order) VALUES (?, ?, ?)',
          [productId, product.images[i], i],
        );
        imageCount++;
      }

      // Insert reviews
      for (const review of product.reviews) {
        await connection.execute(
          `INSERT INTO reviews (
            product_id, rating, comment, review_date, 
            reviewer_name, reviewer_email
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            productId,
            review.rating,
            review.comment,
            convertToMySQLDateTime(review.date),
            review.reviewerName,
            review.reviewerEmail,
          ],
        );
        reviewCount++;
      }

      if (productCount % 10 === 0) {
        console.log(
          `[SEED] Progress: ${productCount}/${products.length} products`,
        );
      }
    }

    // Commit transaction
    await connection.commit();

    console.log('\n[SEED] ✓ Database seeding completed successfully!');
    console.log(`[SEED] - Categories: ${categoriesSet.size}`);
    console.log(`[SEED] - Brands: ${brandsSet.size}`);
    console.log(`[SEED] - Tags: ${tagsSet.size}`);
    console.log(`[SEED] - Products: ${productCount}`);
    console.log(`[SEED] - Reviews: ${reviewCount}`);
    console.log(`[SEED] - Images: ${imageCount}`);
  } catch (error) {
    await connection.rollback();
    console.error('[SEED] Error seeding database:', error);
    throw error;
  } finally {
    await connection.end();
  }
};

// Helper function to convert ISO datetime to MySQL format
function convertToMySQLDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

// Helper functions to get IDs
async function getCategoryId(
  connection: mysql.Connection,
  name: string,
): Promise<number> {
  const [rows]: any = await connection.execute(
    'SELECT id FROM categories WHERE name = ?',
    [name],
  );
  return rows[0].id;
}

async function getBrandId(
  connection: mysql.Connection,
  name: string,
): Promise<number> {
  const [rows]: any = await connection.execute(
    'SELECT id FROM brands WHERE name = ?',
    [name],
  );
  return rows[0].id;
}

async function getTagId(
  connection: mysql.Connection,
  name: string,
): Promise<number> {
  const [rows]: any = await connection.execute(
    'SELECT id FROM tags WHERE name = ?',
    [name],
  );
  return rows[0].id;
}

// Clear all data from tables
export const clearDatabase = async () => {
  const connection = await mysql.createConnection({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
  });

  try {
    console.log('[SEED] Clearing database...');

    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

    await connection.execute('TRUNCATE TABLE product_images');
    await connection.execute('TRUNCATE TABLE product_tags');
    await connection.execute('TRUNCATE TABLE reviews');
    await connection.execute('TRUNCATE TABLE tags');
    await connection.execute('TRUNCATE TABLE products');
    await connection.execute('TRUNCATE TABLE brands');
    await connection.execute('TRUNCATE TABLE categories');

    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    console.log('[SEED] ✓ Database cleared successfully');
  } catch (error) {
    console.error('[SEED] Error clearing database:', error);
    throw error;
  } finally {
    await connection.end();
  }
};

// Re-seed database (clear and seed)
export const reseedDatabase = async () => {
  await clearDatabase();
  await seedDatabase();
};


