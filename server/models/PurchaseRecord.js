import mongoose from 'mongoose';

const poItemSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, required: true, min: 1 },
  receivedQuantity: { type: Number, default: 0 },
  unitPrice: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
});

const purchaseRecordSchema = new mongoose.Schema(
  {
    poNumber: {
      type: String,
      unique: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true,
    },
    items: [poItemSchema],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'partial', 'received', 'cancelled'],
      default: 'draft',
    },
    expectedDate: Date,
    receivedDate: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: String,
  },
  { timestamps: true }
);

purchaseRecordSchema.index({ supplier: 1 });
purchaseRecordSchema.index({ status: 1 });
purchaseRecordSchema.pre('save', async function (next) {
  if (!this.poNumber) {
    const count = await mongoose.model('PurchaseRecord').countDocuments();
    this.poNumber = `PO-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

const PurchaseRecord = mongoose.model('PurchaseRecord', purchaseRecordSchema);
export default PurchaseRecord;
