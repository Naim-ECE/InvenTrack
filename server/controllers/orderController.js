import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Vendor from '../models/Vendor.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

const populateOrder = (query) => query
  .populate('customer', 'name email')
  .populate({ path: 'items.product', populate: { path: 'vendor', select: 'storeName user' } });

export const createOrder = async (req, res) => {
  try {
    const {
      items = [],
      shippingAddress,
      paymentMethod,
      shipping = 0,
      tax = 0,
      discount = 0,
      notes = '',
    } = req.body;

    if (!items.length) return res.status(400).json({ error: 'Order items are required' });

    const productIds = items.map((item) => item.productId || item.product);
    const products = await Product.find({ _id: { $in: productIds }, status: 'active' });
    const productMap = new Map(products.map((product) => [product._id.toString(), product]));

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const id = item.productId || item.product;
      const product = productMap.get(id);
      const quantity = Number(item.quantity || 1);
      if (!product) return res.status(404).json({ error: `Product not found: ${id}` });
      if (product.stock < quantity) return res.status(400).json({ error: `Insufficient stock for ${product.name}` });

      subtotal += product.price * quantity;
      orderItems.push({
        product: product._id,
        productName: product.name,
        productImage: product.image,
        quantity,
        price: product.price,
        variant: item.variant || '',
      });
    }

    const total = Math.max(subtotal + Number(shipping) + Number(tax) - Number(discount), 0);
    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      subtotal,
      shipping,
      tax,
      discount,
      total,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      notes,
    });

    await Promise.all(orderItems.map((item) => Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, totalSold: item.quantity },
    })));
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    const customerNotification = await Notification.create({
      recipient: req.user._id,
      type: 'order',
      title: 'Order placed',
      message: `Your order ${order.orderNumber} has been placed successfully.`,
      data: { orderId: order._id },
    });

    const admins = await User.find({ role: 'admin', isActive: true }).select('_id');
    const io = req.app.get('io');

    if (io) {
      io.to(`user_${req.user._id}`).emit('notification:new', customerNotification.toObject());
    }

    if (admins.length > 0) {
      const adminNotifications = await Notification.insertMany(
        admins.map((admin) => ({
          recipient: admin._id,
          type: 'order',
          title: 'New order received',
          message: `Order ${order.orderNumber} was placed by ${req.user.name}.`,
          data: { orderId: order._id, customerId: req.user._id },
        }))
      );

      if (io) {
        adminNotifications.forEach((notification) => {
          io.to(`user_${notification.recipient.toString()}`).emit('notification:new', notification.toObject());
        });
      }
    }

    const populated = await populateOrder(Order.findById(order._id));
    res.status(201).json({ order: populated });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await populateOrder(Order.find({ customer: req.user._id }).sort({ createdAt: -1 }));
    res.json({ orders });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await populateOrder(Order.findById(req.params.id));
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (req.user.role === 'customer' && order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to view this order' });
    }

    if (req.user.role === 'vendor') {
      const vendor = await Vendor.findOne({ user: req.user._id });
      const hasVendorItem = order.items.some((item) => item.product?.vendor?._id?.toString() === vendor?._id.toString());
      if (!hasVendorItem) return res.status(403).json({ error: 'Not authorized to view this order' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to get order' });
  }
};

export const getVendorOrders = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) return res.status(404).json({ error: 'Vendor profile not found' });

    const vendorProducts = await Product.find({ vendor: vendor._id }).select('_id');
    const orders = await populateOrder(Order.find({ 'items.product': { $in: vendorProducts.map((product) => product._id) } }).sort({ createdAt: -1 }));
    res.json({ orders });
  } catch (error) {
    console.error('Get vendor orders error:', error);
    res.status(500).json({ error: 'Failed to get vendor orders' });
  }
};

export const getAdminOrders = async (_req, res) => {
  try {
    const orders = await populateOrder(Order.find().sort({ createdAt: -1 }));
    res.json({ orders });
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const allowed = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];
    const { status, trackingNumber } = req.body;
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid order status' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = status;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    await order.save();

    await Notification.create({
      recipient: order.customer,
      type: 'order',
      title: 'Order updated',
      message: `Your order ${order.orderNumber} is now ${status}.`,
      data: { orderId: order._id, status },
    });

    const populated = await populateOrder(Order.findById(order._id));
    res.json({ order: populated });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};
