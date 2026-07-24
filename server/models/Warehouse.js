import mongoose from 'mongoose';

const warehouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Warehouse name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    managerName: String,
    capacity: {
      type: Number,
      default: 1000,
    },
    capacityUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalSkus: {
      type: Number,
      default: 0,
    },
    stockValue: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

warehouseSchema.virtual('capacityPercent').get(function () {
  return this.capacity > 0 ? Math.round((this.capacityUsed / this.capacity) * 100) : 0;
});

warehouseSchema.set('toJSON', { virtuals: true });

const Warehouse = mongoose.model('Warehouse', warehouseSchema);
export default Warehouse;
