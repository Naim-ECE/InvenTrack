import mongoose from 'mongoose';

const inventoryLogSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
    },
    type: {
      type: String,
      enum: ['in', 'out', 'adjustment', 'return'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    previousStock: {
      type: Number,
      required: true,
    },
    newStock: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      default: '',
    },
    reference: {
      type: String,
      default: '',
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

inventoryLogSchema.index({ product: 1 });
inventoryLogSchema.index({ warehouse: 1 });
inventoryLogSchema.index({ createdAt: -1 });

const InventoryLog = mongoose.model('InventoryLog', inventoryLogSchema);
export default InventoryLog;
