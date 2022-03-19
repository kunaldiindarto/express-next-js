const Cart = require("../models/cartModel");

module.exports = async (req, res, next) => {
  try {
    const dataCart = await Cart.findById({ _id: req.params.cartId })
      .select("user")
      .populate("user", "email")
      .exec();

    const idUserCart = dataCart.user._id.toString();
    const idUserToken = req.userData.userId;

    idUserCart === idUserToken
      ? next()
      : res.status(400).json({
          message: "Your user cart and token is invalid",
        });
  } catch (error) {
    next(error);
  }
};
