const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { checkAuthRouter } = require("../utils/checkAuth");

const Order = require("../models/orderModel");
const Product = require("../models/productModel");

router.get("/", async (req, res, next) => {
  try {
    const allOrders = await Order.find()
      .select("product quantity")
      .populate("product", "name")
      .exec();

    res.status(200).json({
      count: allOrders.length,
      allOrders: allOrders.map((order) => {
        return {
          _id: order._id,
          product: order.product,
          quantity: order.quantity,
          request: {
            type: "GET",
            url: `http://localhost:3000/order/${order._id}`,
          },
        };
      }),
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/", checkAuthRouter, async (req, res, next) => {
  try {
    const findProduct = await Product.findById(req.body.productId);

    if (!findProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const order = new Order({
      _id: mongoose.Types.ObjectId(),
      quantity: req.body.quantity,
      product: req.body.productId,
    });

    const saveOrder = await order.save();

    res.status(201).json({
      message: "Order saved",
      createdOrder: {
        _id: saveOrder._id,
        product: saveOrder.product,
        quantity: saveOrder.quantity,
      },
      request: {
        type: "GET",
        url: `http://localhost:3000/order/${saveOrder.id}`,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/:orderId", async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("product")
      .exec();
    if (!order) {
      res.status(404).json({
        message: "Order not found",
      });
    }
    res.status(200).json({
      order,
      request: {
        type: "GET",
        url: `http://localhost:3000/order/`,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:orderId", checkAuthRouter, async (req, res, next) => {
  try {
    const deleteOrder = await Order.deleteOne({
      _id: req.params.orderId,
    }).exec();

    res.status(200).json({
      message: "Order deleted",
      request: {
        type: "POST",
        url: `http://localhost:3000/order/`,
        body: {
          productId: "ID",
          quantity: "Number",
        },
      },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
