import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Vendor from '../models/Vendor.js';

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);
const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const normalizeImages = (images = []) => images.map((image) => (
  typeof image === 'string' ? { url: image } : image
)).filter((image) => image?.url);

const resolveCategory = async (category) => {
  if (!category) return null;
  if (isObjectId(category)) return category;

  const slug = slugify(category);
  const existing = await Category.findOne({ $or: [{ slug }, { name: new RegExp(`^${category}$`, 'i') }] });
  if (existing) return existing._id;

  const created = await Category.create({ name: category, slug });
  return created._id;
};

const findCategoryId = async (category) => {
  if (!category) return null;
  if (isObjectId(category)) return category;

  const slug = slugify(category);
  const existing = await Category.findOne({ $or: [{ slug }, { name: new RegExp(`^${category}$`, 'i') }] });
  return existing?._id || null;
};

const getCurrentVendor = async (userId) => Vendor.findOne({ user: userId });

export const getProducts = async (req, res) => {
  try {
    const { category, search, vendorId, status = 'active', page = 1, limit = 12, minPrice, maxPrice } = req.query;
    const filter = {};

    if (status !== 'all') filter.status = status;
    if (category) {
      const categoryId = await findCategoryId(category);
      if (!categoryId) return res.json({ products: [], total: 0, page: Number(page), pages: 0 });
      filter.category = categoryId;
    }
    if (vendorId) filter.vendor = vendorId;
    if (search) filter.$text = { $search: search };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const pageNumber = Math.max(Number(page), 1);
    const pageSize = Math.min(Math.max(Number(limit), 1), 100);
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug image')
        .populate({ path: 'vendor', select: 'storeName logo rating user', populate: { path: 'user', select: 'name email' } })
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize),
      Product.countDocuments(filter),
    ]);

    res.json({ products, total, page: pageNumber, pages: Math.ceil(total / pageSize) });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug image description')
      .populate({ path: 'vendor', select: 'storeName storeDescription logo rating user', populate: { path: 'user', select: 'name email' } });

    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to get product' });
  }
};

export const getVendorProducts = async (req, res) => {
  try {
    const vendor = await getCurrentVendor(req.user._id);
    if (!vendor) return res.status(404).json({ error: 'Vendor profile not found' });

    const products = await Product.find({ vendor: vendor._id }).populate('category', 'name slug').sort({ createdAt: -1 });
    res.json({ products });
  } catch (error) {
    console.error('Get vendor products error:', error);
    res.status(500).json({ error: 'Failed to get vendor products' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const vendor = await getCurrentVendor(req.user._id);
    if (!vendor) return res.status(404).json({ error: 'Vendor profile not found' });

    const categoryId = await resolveCategory(req.body.category || req.body.categoryId);
    const product = await Product.create({
      ...req.body,
      category: categoryId,
      vendor: vendor._id,
      images: normalizeImages(req.body.images),
      status: req.body.status || 'pending',
    });

    await Category.findByIdAndUpdate(categoryId, { $inc: { productCount: 1 } });
    res.status(201).json({ product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (req.user.role !== 'admin') {
      const vendor = await getCurrentVendor(req.user._id);
      if (!vendor || product.vendor.toString() !== vendor._id.toString()) {
        return res.status(403).json({ error: 'Not authorized to update this product' });
      }
    }

    const updates = { ...req.body };
    if (req.body.category || req.body.categoryId) updates.category = await resolveCategory(req.body.category || req.body.categoryId);
    if (req.body.images) updates.images = normalizeImages(req.body.images);

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
      .populate('category', 'name slug')
      .populate('vendor', 'storeName logo');
    res.json({ product: updated });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (req.user.role !== 'admin') {
      const vendor = await getCurrentVendor(req.user._id);
      if (!vendor || product.vendor.toString() !== vendor._id.toString()) {
        return res.status(403).json({ error: 'Not authorized to delete this product' });
      }
    }

    await product.deleteOne();
    await Category.findByIdAndUpdate(product.category, { $inc: { productCount: -1 } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

export const getCategories = async (_req, res) => {
  try {
    const counts = await Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);
    const countMap = new Map(counts.map((item) => [item._id.toString(), item.count]));
    const categories = await Category.find().sort({ name: 1 });

    res.json({
      categories: categories.map((category) => ({
        ...category.toJSON(),
        productCount: countMap.get(category._id.toString()) || category.productCount || 0,
      })),
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
};
