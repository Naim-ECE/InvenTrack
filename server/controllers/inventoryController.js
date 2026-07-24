import Product from '../models/Product.js';
import Warehouse from '../models/Warehouse.js';
import Supplier from '../models/Supplier.js';
import PurchaseRecord from '../models/PurchaseRecord.js';
import InventoryLog from '../models/InventoryLog.js';

export const getWarehouses = async (_req, res) => {
  try {
    const warehouses = await Warehouse.find().populate('manager', 'name email').sort({ createdAt: -1 });
    res.json({ warehouses });
  } catch (error) {
    console.error('Get warehouses error:', error);
    res.status(500).json({ error: 'Failed to get warehouses' });
  }
};

export const createWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.create(req.body);
    res.status(201).json({ warehouse });
  } catch (error) {
    console.error('Create warehouse error:', error);
    res.status(500).json({ error: 'Failed to create warehouse' });
  }
};

export const getSuppliers = async (_req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json({ suppliers });
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({ error: 'Failed to get suppliers' });
  }
};

export const createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json({ supplier });
  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({ error: 'Failed to create supplier' });
  }
};

export const getPurchaseOrders = async (_req, res) => {
  try {
    const purchaseOrders = await PurchaseRecord.find()
      .populate('supplier', 'name email phone')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json({ purchaseOrders });
  } catch (error) {
    console.error('Get purchase orders error:', error);
    res.status(500).json({ error: 'Failed to get purchase orders' });
  }
};

export const createPurchaseOrder = async (req, res) => {
  try {
    const items = (req.body.items || []).map((item) => ({
      ...item,
      total: Number(item.total ?? item.quantity * item.unitPrice),
    }));
    const total = Number(req.body.total ?? items.reduce((sum, item) => sum + item.total, 0));
    const purchaseOrder = await PurchaseRecord.create({ ...req.body, items, total, createdBy: req.user._id });
    res.status(201).json({ purchaseOrder });
  } catch (error) {
    console.error('Create purchase order error:', error);
    res.status(500).json({ error: 'Failed to create purchase order' });
  }
};

export const updatePOStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const purchaseOrder = await PurchaseRecord.findByIdAndUpdate(
      req.params.id,
      { status, ...(status === 'received' ? { receivedDate: new Date() } : {}) },
      { new: true, runValidators: true }
    ).populate('supplier', 'name email phone');
    if (!purchaseOrder) return res.status(404).json({ error: 'Purchase order not found' });
    res.json({ purchaseOrder });
  } catch (error) {
    console.error('Update purchase order error:', error);
    res.status(500).json({ error: 'Failed to update purchase order' });
  }
};

export const getLowStockAlerts = async (_req, res) => {
  try {
    const products = await Product.find({ $expr: { $lte: ['$stock', '$lowStockThreshold'] } })
      .populate('vendor', 'storeName')
      .populate('category', 'name')
      .sort({ stock: 1 });

    const alerts = products.map((product) => ({
      id: product._id,
      productId: product._id,
      productName: product.name,
      productImage: product.image,
      sku: product.sku,
      currentStock: product.stock,
      threshold: product.lowStockThreshold,
      suggestedReorder: Math.max(product.lowStockThreshold * 2 - product.stock, product.lowStockThreshold),
      supplier: product.vendor?.storeName || '',
      warehouse: '',
    }));
    res.json({ alerts });
  } catch (error) {
    console.error('Low stock alerts error:', error);
    res.status(500).json({ error: 'Failed to get low stock alerts' });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { quantity, type = 'adjustment', reason = '', warehouse, reference = '' } = req.body;
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const previousStock = product.stock;
    const delta = type === 'out' ? -Math.abs(Number(quantity)) : Number(quantity);
    product.stock = type === 'adjustment' ? Math.max(Number(quantity), 0) : Math.max(previousStock + delta, 0);
    await product.save();

    const log = await InventoryLog.create({
      product: product._id,
      warehouse,
      type,
      quantity: type === 'adjustment' ? product.stock - previousStock : delta,
      previousStock,
      newStock: product.stock,
      reason,
      reference,
      performedBy: req.user._id,
    });

    res.json({ product, log });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ error: 'Failed to update stock' });
  }
};
