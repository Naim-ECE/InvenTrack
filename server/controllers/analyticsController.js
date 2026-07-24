import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Vendor from '../models/Vendor.js';
import Notification from '../models/Notification.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [users, products, orders, vendors, revenue, recentProducts, recentOrders, recentVendors, recentNotifications, lowStockProducts] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Vendor.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
      Product.find()
        .populate('category', 'name slug image')
        .populate({ path: 'vendor', select: 'storeName logo rating user', populate: { path: 'user', select: 'name email' } })
        .sort({ createdAt: -1 })
        .limit(5),
      Order.find()
        .populate('customer', 'name email')
        .populate({ path: 'items.product', select: 'name image', populate: { path: 'vendor', select: 'storeName' } })
        .sort({ createdAt: -1 })
        .limit(5),
      Vendor.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(5),
      Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }).limit(5),
      Product.find({ stock: { $lte: 10 } }).select('_id').limit(20),
    ]);

    res.json({
      stats: {
        users,
        products,
        orders,
        vendors,
        revenue: revenue[0]?.total || 0,
        lowStock: lowStockProducts.length,
      },
      recentProducts,
      recentOrders,
      recentVendors,
      recentNotifications,
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
};

export const getSalesAnalytics = async (_req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          revenue: 1,
          orders: 1,
        },
      },
    ]);

    res.json({ sales });
  } catch (error) {
    console.error('Sales analytics error:', error);
    res.status(500).json({ error: 'Failed to get sales analytics' });
  }
};
