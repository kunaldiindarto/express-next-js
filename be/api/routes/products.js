const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");

const { checkAuthRouter } = require("../utils/checkAuth");
const { deletePhoto } = require("../utils/deletePhoto");
const {
  nameFilterPost,
  nameFilterPatch,
} = require("../utils/checkNameProduct");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
});

const upload2 = multer();

const Product = require("../models/productModel");

// define the home page route /product
router.get("/", async (req, res, next) => {
  try {
    const result = await Product.find()
      .select("name price _id productImage")
      .exec();
    res.status(200).json({
      message: "get /product dan ambil semua data",
      result,
    });
  } catch (error) {
    return next(error);
  }
});

router.post(
  "/",
  checkAuthRouter,
  upload.single("productImage"),
  nameFilterPost,
  async (req, res, next) => {
    try {
      if (req.file === undefined) {
        res.status(400).json({
          message: "Please check again your productImage",
        });
      } else {
        const product = new Product({
          _id: new mongoose.Types.ObjectId(),
          name: req.body.name,
          price: req.body.price,
          productImage: req.file.path,
        });

        const saveProduct = await product.save();

        res.status(201).json({
          message: "Created New Product Success",
          createdProduct: {
            _id: saveProduct._id,
            name: saveProduct.name,
            price: saveProduct.price,
            request: {
              type: "GET",
              url: `http://localhost:3000/products/${saveProduct._id}`,
            },
          },
        });
      }
    } catch (error) {
      return next(error);
    }
  }
);

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

router.patch(
  "/:productId",
  checkAuthRouter,
  upload.single("productImage"),
  nameFilterPatch,
  async (req, res, next) => {
    try {
      let newPathFile = "";
      // *validasi ID
      const id = req.params.productId;
      const findID = await Product.findOne({ _id: id });

      if (findID === null) {
        res.status(404).json({
          message: "Input product ID is not valid, please check your input ID",
        });
      }
      // check price
      let price = "";
      req.body.price === undefined
        ? (price = findID.price)
        : (price = req.body.price);

      const oldPathFile = findID.productImage;
      if (req.file === undefined) {
        newPathFile = oldPathFile;
      } else {
        deletePhoto(oldPathFile);
        newPathFile = req.file.path;
      }
      const result = await Product.updateOne(
        { _id: id },
        {
          $set: {
            name: req.body.name,
            price,
            productImage: newPathFile,
          },
        }
      ).exec();
      res.status(200).json({
        message: "Product Updated",
        request: {
          type: "GET",
          url: `http://localhost:3000/products/${id}`,
        },
      });

      // variabel cek diisi kosong atau engga
    } catch (error) {
      return next(error);
    }
  }
);

router.delete("/:productId", checkAuthRouter, async (req, res, next) => {
  try {
    const id = req.params.productId;
    // delete photo
    const findData = await Product.findById(id).exec();
    deletePhoto(findData.productImage);
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
