const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { checkAuthRouter } = require("../utils/checkAuth");

const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

router.post("/add", checkAuthRouter, async (req, res, next) => {
  try {
    // ambil data cart
    const findCart = await Cart.findById(req.body.cartId)
      .populate({
        path: "products.product",
        select: "name price",
      })
      .exec();
    // ambil data products dan product id terus quantity nya

    const cartProduct = findCart.products;
    let dataPrice = [];
    let dataQuantity = [];
    let totalPerProduct = [];

    cartProduct.forEach((el) => {
      dataPrice.push(el.product.price);
      dataQuantity.push(el.quantity);
    });

    let nilaiTotal = 0;
    for (let i = 0; i < cartProduct.length; i++) {
      nilaiTotal = dataPrice[i] * dataQuantity[i];
      totalPerProduct.push(nilaiTotal);
    }
    const totalPrice = totalPerProduct.reduce((acc, curr) => acc + curr);

    //ambil data user
    const findUser = await Cart.findById(req.body.cartId)
      .select("user")
      .populate({
        path: "user",
        select: "user._id email",
      })
      .exec();
    // *pengecekan order sama dengan input userId
    if (findUser.user._id.toString() === req.body.userId) {
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        cart: req.body.cartId,
        user: findUser.user._id,
        totalPrice,
      });
      const orderDoc = await order.save();
      res.status(200).json({
        message: "Your order success",
        order: orderDoc._id,
      });
    } else {
      res.status(400).json({
        message: "Your order failed, userId not match with user Id cart",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/", checkAuthRouter, async (req, res, next) => {
  try {
    const findOrder = await Order.find({ user: req.userData.userId })
      .select("products user totalPrice updatedAt")
      .populate({
        path: "cart",
        populate: {
          path: "products.product",
          select: "name",
        },
      })
      .exec();
    if (findOrder.length > 0) {
      const dataOrder = findOrder.map((el) => {
        return {
          _id: el._id,
          totalPrice: el.totalPrice,
          products: el.cart.products,
        };
      });

      res.status(200).json({
        message: "Result Order",
        dataOrder,
      });
    } else {
      res.status(400).json({
        message: "Your order is not found",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/:orderId", checkAuthRouter, async (req, res, next) => {
  try {
    const user = req.userData.userId;
    const orderDoc = await Order.find({ _id: req.params.orderId, user })
      .populate({
        path: "cart",
        populate: {
          path: "products.product",
          select: "name",
        },
      })
      .exec();
    if (orderDoc.length < 1) {
      res.status(400).json({
        message: "Order not available",
      });
    } else {
      // console.log(orderDoc);
      let order = orderDoc.map((el) => {
        return {
          _id: el._id,
          totalPrice: el.totalPrice,
          created: el.createdAt,
          products: el.cart.products,
        };
      });
      res.status(200).json({
        message: "spesifik order Id",
        order,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/cancel/:orderId", checkAuthRouter, async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const findOrder = await Order.findOne({ _id: orderId }).exec();
    if (findOrder !== null) {
      const cartId = findOrder.cart;
      await Order.deleteOne({ _id: orderId });
      await Cart.deleteOne({ _id: findOrder.cart });
      res.status(200).json({
        message: "Success Deleted",
      });
    } else {
      res.status(400).json({
        message: "Order not found",
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
