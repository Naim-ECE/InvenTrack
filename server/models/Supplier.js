import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Supplier name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
    },
    phone: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    onTimeDelivery: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    avgLeadTime: {
      type: Number,
      default: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    categories: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

supplierSchema.index({ name: 'text' });

const Supplier = mongoose.model('Supplier', supplierSchema);
export default Supplier;
