const Product = require("../models/productModel");
const { deletePhoto } = require("../utils/deletePhoto");

const nameFilterPost = async (req, res, next) => {
  try {
    const findName = await Product.findOne({ name: req.body.name });
    if (findName !== null) {
      // hapus file gambar
      deletePhoto(req.file.path);
      res.status(400).json({
        message: "Name Product is already exist",
      });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

const nameFilterPatch = async (req, res, next) => {
  try {
    const findName = await Product.findOne({ name: req.body.name });
    if (findName !== null) {
      res.status(400).json({
        message: "Name Product is already exist",
      });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { nameFilterPost, nameFilterPatch };
