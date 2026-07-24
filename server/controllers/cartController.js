import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const populateCart = (query) => query.populate({
  path: 'items.product',
  populate: [
    { path: 'category', select: 'name slug' },
    { path: 'vendor', select: 'storeName logo rating' },
  ],
});

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

export const getCart = async (req, res) => {
  try {
    await getOrCreateCart(req.user._id);
    const cart = await populateCart(Cart.findOne({ user: req.user._id }));
    res.json({ cart });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to get cart' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, product, quantity = 1, variant = '' } = req.body;
    const productIdValue = productId || product;
    const existingProduct = await Product.findById(productIdValue);
    if (!existingProduct || existingProduct.status !== 'active') {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (existingProduct.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find((cartItem) => (
      cartItem.product.toString() === productIdValue && (cartItem.variant || '') === variant
    ));

    if (item) item.quantity += Number(quantity);
    else cart.items.push({ product: productIdValue, quantity, variant });

    await cart.save();
    const populated = await populateCart(Cart.findOne({ user: req.user._id }));
    res.status(201).json({ cart: populated });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Cart item not found' });

    if (Number(quantity) <= 0) item.deleteOne();
    else item.quantity = Number(quantity);

    await cart.save();
    const populated = await populateCart(Cart.findOne({ user: req.user._id }));
    res.json({ cart: populated });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Cart item not found' });
    item.deleteOne();
    await cart.save();
    const populated = await populateCart(Cart.findOne({ user: req.user._id }));
    res.json({ cart: populated });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ error: 'Failed to remove cart item' });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    await cart.save();
    res.json({ cart });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};
