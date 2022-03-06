const express = require("express");
const router = express.Router();

// define the home page route
router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "get /product dan ambil semua data",
  });
});

router.post("/", (req, res, next) => {
  res.status(200).json({
    message: "post /product Menambahkan product",
  });
});

router.get("/:productId", (req, res, next) => {
  if (req.params.productId === "special") {
    res.status(200).json({
      message: "get /product dan ambil satu data berdasarkan Id",
    });
  } else {
    res.status(200).json({
      message: "Yang kamu masukan salah",
    });
  }
});

router.patch("/:productId", (req, res, next) => {
  res.status(200).json({
    message: "patch /product update data berdasarkan Id",
  });
});

router.delete("/:productId", (req, res, next) => {
  res.status(200).json({
    message: "delete /product berdasarkan Id",
  });
});

module.exports = router;
