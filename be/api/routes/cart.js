const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { checkAuthRouter } = require("../utils/checkAuth");
const filterAuth = require("../utils/filterAuth");

const Cart = require("../models/cartModel");

router.get("/", async (req, res, next) => {
  try {
    const cartAll = await Cart.find().exec();

    res.status(200).json({
      message: "cart ok",
      cartAll,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:cartId", checkAuthRouter, filterAuth, async (req, res, next) => {
  try {
    const resultCart = await Cart.findOne({ _id: req.params.cartId }).exec();
    res.status(200).json({
      message: "cart product by id",
      resultCart,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/add", checkAuthRouter, async (req, res, next) => {
  try {
    console.log(req.userData.userId);
    // *bikin subdocument dan input
    const products = {
      product: req.body.productId,
      quantity: req.body.quantity,
    };

    const cart = new Cart({
      _id: mongoose.Types.ObjectId(),
      products,
      user: req.userData.userId,
    });

    const insCart = await cart.save();

    console.log(req.userData);
    res.status(201).json({
      message: "Success add product to cart",
      cartId: insCart._id,
    });
  } catch (err) {
    next(err);
  }
});

router.delete(
  "/delete/:cartId",
  checkAuthRouter,
  filterAuth,
  async (req, res, next) => {
    try {
      const delCart = await Cart.deleteOne({ _id: req.params.cartId });

      res.status(200).json({
        message: "The cart success deleted",
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/add/:cartId",
  checkAuthRouter,
  filterAuth,
  async (req, res, next) => {
    try {
      const product = {
        product: req.body.productId,
        quantity: req.body.quantity,
      };

      const updateCart = await Cart.updateOne(
        { _id: req.params.cartId },
        { $push: { products: product } }
      ).exec();

      res.status(200).json({
        message: "Success add more product to cart",
        updateCart,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete/:cartId/:productId",
  checkAuthRouter,
  filterAuth,
  async (req, res, next) => {
    try {
      const product = { product: req.params.productId };

      const pullUpdateCart = await Cart.updateOne(
        { _id: req.params.cartId },
        {
          $pull: {
            products: product,
          },
        }
      ).exec();

      res.status(200).json({
        message: "Success deleted product from cart",
        pullUpdateCart,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/edit/:cartId",
  checkAuthRouter,
  filterAuth,
  async (req, res, next) => {
    try {
      /*
      1. pull data yang exist berdasarkan productId
      2. push data yang baru dengan quantity
      */
      const newProduct = {
        product: req.body.productId,
        quantity: req.body.quantity,
      };

      const pullOldProduct = await Cart.updateOne(
        { _id: req.params.cartId },
        {
          $pull: {
            products: { product: req.body.productId },
          },
        }
      ).exec();
      const pushNewProduct = await Cart.updateOne(
        { _id: req.params.cartId },
        {
          $push: {
            products: newProduct,
          },
        }
      ).exec();

      res.status(201).json({
        message: "Edit quantity product success",
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
