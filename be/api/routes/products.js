const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/productModel");

// define the home page route
router.get("/", async (req, res, next) => {
  try {
    const result = await Product.find().exec();
    res.status(200).json({
      message: "get /product dan ambil semua data",
      result,
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
    });

    const saveProduct = await product.save();

    res.status(201).json({
      message: "post /product Menambahkan product",
      createdProduct: product,
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/:productId", async (req, res, next) => {
  try {
    const id = req.params.productId;
    const result = await Product.findById(id).exec();

    res.status(200).json({
      message: "get /product ambil satu data berdasarkan Id",
      result,
    });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:productId", async (req, res, next) => {
  try {
    const id = req.params.productId;
    const result = await Product.updateOne(
      { _id: id },
      { $set: req.body }
    ).exec();
    res.status(200).json({
      message: "patch /product update data berdasarkan Id",
      result,
    });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:productId", async (req, res, next) => {
  try {
    const id = req.params.productId;
    const result = await Product.deleteOne({ _id: id }).exec();

    res.status(200).json({
      message: "delete /product berdasarkan Id",
      result,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
