const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
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

module.exports = mongoose.model("Product", productSchema);
