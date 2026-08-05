import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Vendor from '../models/Vendor.js';

const getVendor = async (userId) => Vendor.findOne({ user: userId });

export const getDashboardStats = async (req, res) => {
  try {
    const vendor = await getVendor(req.user._id);
    if (!vendor) return res.status(404).json({ error: 'Vendor profile not found' });

    const products = await Product.find({ vendor: vendor._id }).select('_id stock totalSold status');
    const productIds = products.map((product) => product._id);
    const orders = await Order.find({ 'items.product': { $in: productIds } });
    const revenue = orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => (
      productIds.some((id) => id.toString() === item.product.toString()) ? itemSum + item.price * item.quantity : itemSum
    ), 0), 0);

    res.json({
      stats: {
        products: products.length,
        activeProducts: products.filter((product) => product.status === 'active').length,
        orders: orders.length,
        revenue,
        lowStock: products.filter((product) => product.stock > 0 && product.stock < 8).length,
        totalSold: products.reduce((sum, product) => sum + product.totalSold, 0),
      },
    });
  } catch (error) {
    console.error('Vendor dashboard error:', error);
    res.status(500).json({ error: 'Failed to get vendor dashboard stats' });
  }
};

export const getEarnings = async (req, res) => {
  try {
    const vendor = await getVendor(req.user._id);
    if (!vendor) return res.status(404).json({ error: 'Vendor profile not found' });

    const products = await Product.find({ vendor: vendor._id }).select('_id');
    const productIds = products.map((product) => product._id.toString());
    const orders = await Order.find({ 'items.product': { $in: products.map((product) => product._id) } }).sort({ createdAt: -1 });
    const gross = orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => (
      productIds.includes(item.product.toString()) ? itemSum + item.price * item.quantity : itemSum
    ), 0), 0);
    const commission = gross * (vendor.commission / 100);

    res.json({ earnings: { gross, commission, net: gross - commission, orders } });
  } catch (error) {
    console.error('Vendor earnings error:', error);
    res.status(500).json({ error: 'Failed to get vendor earnings' });
  }
};

export const updateStoreSettings = async (req, res) => {
  try {
    const allowed = ['storeName', 'storeDescription', 'logo', 'bankDetails'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    const vendor = await Vendor.findOneAndUpdate({ user: req.user._id }, updates, { new: true, runValidators: true });
    if (!vendor) return res.status(404).json({ error: 'Vendor profile not found' });
    res.json({ vendor });
  } catch (error) {
    console.error('Update vendor settings error:', error);
    res.status(500).json({ error: 'Failed to update store settings' });
  }
};
