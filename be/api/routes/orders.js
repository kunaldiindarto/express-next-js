const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "melihar rekap order",
  });
});

router.post("/", (req, res, next) => {
  res.status(200).json({
    message: "order created",
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
    message: "delete order",
  });
});

module.exports = router;
