import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB, { disconnectDB } from '../config/db.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Vendor from '../models/Vendor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../app/.env') });

const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.VITE_CLOUDINARY_UPLOAD_PRESET || process.env.CLOUDINARY_UPLOAD_PRESET;
const imageFolder = 'inventrack/catalog';

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const categories = [
  { name: 'Electronics', image: 'category-electronics.jpg', description: 'Smart devices, audio gear, and accessories.' },
  { name: 'Fashion', image: 'category-fashion.jpg', description: 'Apparel and personal style essentials.' },
  { name: 'Groceries', image: 'category-groceries.jpg', description: 'Pantry staples and specialty food items.' },
  { name: 'Home & Living', image: 'category-home.jpg', description: 'Everyday home organization and living products.' },
  { name: 'Accessories', image: 'category-accessories.jpg', description: 'Carry, protect, and personalize your gear.' },
  { name: 'Office Equipment', image: 'category-office.jpg', description: 'Workspace organization and productivity tools.' },
];

const vendors = [
  { storeName: 'TechHub Store', email: 'techhub@inventrack.dev', name: 'TechHub Store' },
  { storeName: 'WearableTech', email: 'wearabletech@inventrack.dev', name: 'WearableTech' },
  { storeName: 'AudioMax', email: 'audiomax@inventrack.dev', name: 'AudioMax' },
  { storeName: 'GameGear Pro', email: 'gamegearpro@inventrack.dev', name: 'GameGear Pro' },
  { storeName: 'StyleVault', email: 'stylevault@inventrack.dev', name: 'StyleVault' },
  { storeName: 'FitFootwear', email: 'fitfootwear@inventrack.dev', name: 'FitFootwear' },
  { storeName: 'BeanBrothers', email: 'beanbrothers@inventrack.dev', name: 'BeanBrothers' },
  { storeName: 'WorkspaceCo', email: 'workspaceco@inventrack.dev', name: 'WorkspaceCo' },
];

const products = [
  {
    name: 'Wireless Earbuds Pro',
    description: 'Premium wireless earbuds with active noise cancellation, 30-hour battery life, and crystal-clear sound quality. Featuring touch controls, water resistance, and a compact charging case.',
    shortDescription: 'ANC wireless earbuds with 30h battery',
    price: 89.99,
    category: 'Electronics',
    images: ['product-earbuds.jpg', 'product-speaker.jpg'],
    rating: 4.5,
    reviewCount: 128,
    vendor: 'TechHub Store',
    sku: 'MRP001',
    stock: 47,
    lowStockThreshold: 10,
    status: 'active',
    specifications: { 'Battery Life': '30 hours', Connectivity: 'Bluetooth 5.3', Weight: '48g', 'Water Resistance': 'IPX4' },
  },
  {
    name: 'Smartwatch Ultra',
    description: 'Advanced fitness smartwatch with GPS, heart rate monitoring, sleep tracking, and 14-day battery life. Features a stunning AMOLED display and premium metal build.',
    shortDescription: 'GPS fitness smartwatch, 14-day battery',
    price: 199.0,
    category: 'Electronics',
    images: ['product-smartwatch.jpg'],
    rating: 4.8,
    reviewCount: 256,
    vendor: 'WearableTech',
    sku: 'MRP002',
    stock: 32,
    lowStockThreshold: 10,
    status: 'active',
    specifications: { Display: '1.43" AMOLED', Battery: '14 days', GPS: 'Built-in', 'Water Resistance': '5 ATM' },
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Powerful portable speaker with 360-degree sound, 20-hour battery, and waterproof design. Perfect for outdoor adventures and parties.',
    shortDescription: '360° sound, 20h battery, waterproof',
    price: 129.0,
    originalPrice: 149.0,
    category: 'Electronics',
    images: ['product-speaker.jpg'],
    rating: 4.3,
    reviewCount: 89,
    vendor: 'AudioMax',
    sku: 'MRP003',
    stock: 15,
    lowStockThreshold: 10,
    status: 'active',
    specifications: { Battery: '20 hours', Power: '30W', 'Water Resistance': 'IPX7', Weight: '580g' },
  },
  {
    name: 'Gaming Mouse RGB',
    description: 'High-precision gaming mouse with 25K DPI sensor, customizable RGB lighting, 8 programmable buttons, and ergonomic design for extended gaming sessions.',
    shortDescription: '25K DPI gaming mouse with RGB',
    price: 49.99,
    originalPrice: 62.49,
    category: 'Electronics',
    images: ['product-mouse.jpg'],
    rating: 4.6,
    reviewCount: 342,
    vendor: 'GameGear Pro',
    sku: 'MRP004',
    stock: 5,
    lowStockThreshold: 10,
    status: 'active',
    specifications: { DPI: '25,000', Buttons: '8 programmable', Connection: 'Wired/USB', Weight: '85g' },
  },
  {
    name: 'Leather Jacket Premium',
    description: 'Genuine leather motorcycle jacket with quilted lining, multiple pockets, and premium hardware. Classic design that never goes out of style.',
    shortDescription: 'Genuine leather motorcycle jacket',
    price: 249.0,
    category: 'Fashion',
    images: ['product-jacket.jpg'],
    rating: 4.7,
    reviewCount: 67,
    vendor: 'StyleVault',
    sku: 'MRP005',
    stock: 22,
    lowStockThreshold: 5,
    status: 'active',
    specifications: { Material: 'Genuine Leather', Lining: 'Quilted Polyester', Pockets: '5', Care: 'Professional clean' },
  },
  {
    name: 'Running Shoes Ultra',
    description: 'Lightweight running shoes with responsive cushioning, breathable mesh upper, and durable rubber outsole. Designed for both road and track.',
    shortDescription: 'Lightweight cushioned running shoes',
    price: 129.0,
    category: 'Fashion',
    images: ['product-shoes.jpg'],
    rating: 4.4,
    reviewCount: 189,
    vendor: 'FitFootwear',
    sku: 'MRP006',
    stock: 38,
    lowStockThreshold: 10,
    status: 'active',
    specifications: { Upper: 'Breathable Mesh', Sole: 'Rubber', Weight: '268g', Drop: '8mm' },
  },
  {
    name: 'Organic Coffee Beans',
    description: 'Single-origin Ethiopian coffee beans, medium roast with notes of blueberry, chocolate, and citrus. Freshly roasted and ethically sourced.',
    shortDescription: 'Single-origin Ethiopian, medium roast',
    price: 24.99,
    category: 'Groceries',
    images: ['product-coffee.jpg'],
    rating: 4.9,
    reviewCount: 423,
    vendor: 'BeanBrothers',
    sku: 'MRP007',
    stock: 85,
    lowStockThreshold: 20,
    status: 'active',
    specifications: { Origin: 'Ethiopia', Roast: 'Medium', Weight: '500g', Process: 'Washed' },
  },
  {
    name: 'Desk Organizer Set',
    description: 'Complete desk organization solution with pen holder, document tray, and 3-drawer unit. Made of durable metal mesh in a modern black finish.',
    shortDescription: 'Metal mesh desk organizer, 3-piece set',
    price: 34.99,
    originalPrice: 38.99,
    category: 'Office Equipment',
    images: ['product-organizer.jpg'],
    rating: 4.2,
    reviewCount: 56,
    vendor: 'WorkspaceCo',
    sku: 'MRP008',
    stock: 63,
    lowStockThreshold: 15,
    status: 'active',
    specifications: { Material: 'Metal Mesh', Color: 'Black', Pieces: '3', Weight: '1.2kg' },
  },
];

const uploadLocalImage = async (filename) => {
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary upload preset/cloud name are missing. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to app/.env.');
  }

  const imagePath = path.resolve(__dirname, '../../app/public/images', filename);
  const fileBuffer = await fs.readFile(imagePath);
  const formData = new FormData();
  formData.append('file', new Blob([fileBuffer], { type: 'image/jpeg' }), filename);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', imageFolder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result?.error?.message || `Cloudinary upload failed for ${filename}`);
  }

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

const ensureCategory = async (categorySeed) => {
  const image = await uploadLocalImage(categorySeed.image);
  return Category.findOneAndUpdate(
    { slug: slugify(categorySeed.name) },
    {
      name: categorySeed.name,
      slug: slugify(categorySeed.name),
      image: image.url,
      description: categorySeed.description,
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );
};

const ensureVendor = async (vendorSeed) => {
  const user = await User.findOneAndUpdate(
    { email: vendorSeed.email },
    {
      name: vendorSeed.name,
      email: vendorSeed.email,
      role: 'vendor',
      authProvider: 'google',
      firebaseUid: `seed-${slugify(vendorSeed.storeName)}`,
      avatar: '',
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  return Vendor.findOneAndUpdate(
    { user: user._id },
    {
      user: user._id,
      storeName: vendorSeed.storeName,
      storeDescription: `${vendorSeed.storeName} official storefront`,
      isApproved: true,
      approvedAt: new Date(),
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );
};

const ensureProduct = async (productSeed, categoryId, vendorId) => {
  const images = [];
  for (const filename of productSeed.images) {
    images.push(await uploadLocalImage(filename));
  }

  return Product.findOneAndUpdate(
    { sku: productSeed.sku },
    {
      name: productSeed.name,
      description: productSeed.description,
      shortDescription: productSeed.shortDescription,
      price: productSeed.price,
      originalPrice: productSeed.originalPrice,
      category: categoryId,
      images,
      vendor: vendorId,
      sku: productSeed.sku,
      stock: productSeed.stock,
      lowStockThreshold: productSeed.lowStockThreshold,
      status: productSeed.status,
      rating: productSeed.rating,
      reviewCount: productSeed.reviewCount,
      specifications: productSeed.specifications,
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );
};

const seedCatalog = async () => {
  await connectDB();

  try {
    console.log('Seeding categories...');
    const seededCategories = new Map();
    for (const categorySeed of categories) {
      const category = await ensureCategory(categorySeed);
      seededCategories.set(categorySeed.name, category);
    }

    console.log('Seeding vendors...');
    const seededVendors = new Map();
    for (const vendorSeed of vendors) {
      const vendor = await ensureVendor(vendorSeed);
      seededVendors.set(vendorSeed.storeName, vendor);
    }

    console.log('Seeding products and uploading images...');
    const productCounts = new Map();
    const seededProducts = [];

    for (const productSeed of products) {
      const category = seededCategories.get(productSeed.category);
      const vendor = seededVendors.get(productSeed.vendor);

      if (!category) throw new Error(`Missing category for ${productSeed.name}`);
      if (!vendor) throw new Error(`Missing vendor for ${productSeed.name}`);

      const product = await ensureProduct(productSeed, category._id, vendor._id);
      seededProducts.push(product);
      productCounts.set(productSeed.category, (productCounts.get(productSeed.category) || 0) + 1);
    }

    await Promise.all(
      [...seededCategories.entries()].map(([categoryName, categoryDoc]) => Category.findByIdAndUpdate(categoryDoc._id, {
        productCount: productCounts.get(categoryName) || 0,
      }))
    );

    console.log(`Seeded ${seededCategories.size} categories, ${seededVendors.size} vendors, and ${seededProducts.length} products.`);
    for (const product of seededProducts) {
      console.log(`${product.sku}: ${product.images?.[0]?.url || 'no image'}`);
    }
  } catch (error) {
    console.error('Catalog seed failed:', error);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
};

seedCatalog().catch((error) => {
  console.error('Unexpected catalog seed failure:', error);
  process.exit(1);
});