import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    storeName: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true,
      maxlength: [100, 'Store name cannot exceed 100 characters'],
    },
    storeDescription: {
      type: String,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    logo: {
      type: String,
      default: '',
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvedAt: Date,
    commission: {
      type: Number,
      default: 10,
      min: 0,
      max: 100,
    },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      bankName: String,
      routingNumber: String,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

vendorSchema.index({ isApproved: 1 });
vendorSchema.index({ storeName: 'text' });

const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;
