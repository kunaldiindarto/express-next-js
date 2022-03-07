const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "melihar rekap order",
  });
});

router.post("/", (req, res, next) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity,
  };
  res.status(200).json({
    message: "Order created",
    order,
  });
});

router.get("/:orderId", (req, res, next) => {
  if (req.params.orderId === "special") {
    res.status(200).json({
      message: "see order detail",
    });
  } else {
    res.status(200).json({
      message: "Yang kamu masukan salah, coba lagi",
    });
  }
});

router.delete("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "Order deleted",
    orderId: req.params.orderID,
  });
});

module.exports = router;
