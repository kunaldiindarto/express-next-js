const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { passwordStrength } = require("check-password-strength");
const { defaultOptions } = require("../utils/defaultOptions");

const User = require("../models/userModel");

// *bayangan cuma buat tes, nanti hapus aja di akhir
router.get("/", async (req, res, next) => {
  try {
    const findUser = await User.find().exec();
    res.status(200).json({
      findUser,
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const findEmail = await User.find({ email: req.body.email }).exec();
    const checkPass = passwordStrength(req.body.password, defaultOptions);
    console.log(checkPass.value.toLowerCase());

    if (findEmail.length >= 1) {
      res.status(400).json({
        message: "Email exist, try another email to signup",
        email: req.body.email,
      });
    } else {
      if (
        checkPass.length < 8 ||
        checkPass.value === "Too weak" ||
        checkPass.value === "Weak"
      ) {
        res.status(400).json({
          message: `Check again your password because ${checkPass.value} or length password less than 8`,
        });
      } else {
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
          _id: mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hashPassword,
        });

        const saveUser = await user.save();

        console.log(saveUser);

        res.status(201).json({
          message: "User created",
          email: saveUser.email,
        });
      }
    }
  } catch (error) {
    return next(error);
  }
});

router.delete("/:userId", async (req, res, next) => {
  try {
    const result = await User.deleteOne({ _id: req.params.userId }).exec();
    res.status(200).json({
      message: "User Deleted",
    });
  } catch (error) {
    return next(error);
  }
});
module.exports = router;
