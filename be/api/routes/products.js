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
      message: "Created New Product Success",
      createdProduct: {
        _id: saveProduct._id,
        name: saveProduct.name,
        price: saveProduct.price,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/:productId", async (req, res, next) => {
  try {
    const id = req.params.productId;
    const result = await Product.findById(id).exec();

    if (result) {
      res.status(200).json({
        product: {
          _id: result._id,
          name: result.name,
          price: result.price,
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/products",
        },
      });
    } else {
      res.status(404).json({
        message: "Input Product ID is not valid, please check your input ID",
      });
    }
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
      message: "Product Updated",
      request: {
        type: "GET",
        url: `http://localhost:3000/products/${id}`,
      },
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
      message: "Product Deleted",
      request: {
        type: "POST",
        url: `http://localhost:3000/products`,
        body: {
          name: "String",
          price: "Number",
        },
      },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
