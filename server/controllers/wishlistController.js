import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

const populateWishlist = (query) => query.populate({
  path: 'products',
  populate: [
    { path: 'category', select: 'name slug' },
    { path: 'vendor', select: 'storeName logo rating' },
  ],
});

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) wishlist = await Wishlist.create({ user: userId, products: [] });
  return wishlist;
};

export const getWishlist = async (req, res) => {
  try {
    await getOrCreateWishlist(req.user._id);
    const wishlist = await populateWishlist(Wishlist.findOne({ user: req.user._id }));
    res.json({ wishlist });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ error: 'Failed to get wishlist' });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const productId = req.body.productId || req.body.product;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const wishlist = await getOrCreateWishlist(req.user._id);
    if (!wishlist.products.some((item) => item.toString() === productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    const populated = await populateWishlist(Wishlist.findOne({ user: req.user._id }));
    res.status(201).json({ wishlist: populated });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await getOrCreateWishlist(req.user._id);
    wishlist.products = wishlist.products.filter((product) => product.toString() !== req.params.productId);
    await wishlist.save();
    const populated = await populateWishlist(Wishlist.findOne({ user: req.user._id }));
    res.json({ wishlist: populated });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
};
