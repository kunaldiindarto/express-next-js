const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    createdAt: {
      type: Date,
      immutable: true, //penting biar gabisa dirubah rubah
      // default: new Date(),
      default: () => Date.now(),
    },
    updatedAt: {
      type: Date,
      // default: new Date(),
      default: () => Date.now(),
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Order", orderSchema);
