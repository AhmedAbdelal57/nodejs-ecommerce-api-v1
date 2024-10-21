const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");

const CartModel = require("../models/cartModel");
const CouponModel = require("../models/couponModel");
const ProductModel = require("../models/productModel");
const { status } = require("express/lib/response");

const calcTOtalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

//@desc add product to  Cart
//@route POST /api/v1/carts
//@access Protected (user)
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity, color } = req.body;
  const Product = await ProductModel.findById(productId);
  // 1- get cart of logged user
  let Cart = await CartModel.findOne({ user: req.user._id });
  if (!Cart) {
    // create Cart of logged user with product
    Cart = await CartModel.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          quantity: quantity,
          color: color,
          price: Product.price,
        },
      ],
    });
    //console.log("Cart is created" , Cart);
  } else {
    //console.log(" There is already a cart of logged user");
    // product exist in cart , update product quantity
    const productExist = Cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    console.log(productExist);
    if (productExist > -1) {
      // update quantity
      Cart.cartItems[productExist].quantity += quantity;
      //console.log("Product quantity updated in cart");
    } else {
      //product not exist in cart ,push product to cartItems array
      Cart.cartItems.push({
        product: productId,
        quantity: quantity,
        color: color,
        price: Product.price,
      });
    }

    //console.log("Product is added to cart");
  }
  // calculate total cart price
  calcTOtalCartPrice(Cart);
  /* let totalPrice = 0;
  Cart.cartItems.forEach((product) => {
    totalPrice += product.quantity * product.price;
  });
  Cart.totalCartPrice = totalPrice; */
  await Cart.save();

  res.status(200).json({
    status: "success",
    message: "product added successfully",
    umOfCartItem: Cart.cartItems.length,
    data: Cart,
  });
});

//@desc Get logged user cart
//@route Get /api/v1/carts
//@access Protected (user)
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const Cart = await CartModel.findOne({ user: req.user._id });
  if (!Cart) {
    return next(
      new ApiError(`There is no cart for this user${req.user._id}`, 404)
    );
  }
  res.status(200).json({
    status: "success",
    numOfCartItem: Cart.cartItems.length,
    data: Cart,
  });
});
//@desc delete specific cart item
//@route delete /api/v1/cart/itemId
//@access Protected (user)
exports.removeSpecificCartItems = asyncHandler(async (req, res, next) => {
  const Cart = await CartModel.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.itemId } } },
    { new: true }
  );

  calcTOtalCartPrice(Cart);
  Cart.save();
  res.status(200).json({
    status: "success",
    message: "item removed successfully",
    numOfCartItem: Cart.cartItems.length,
    data: Cart,
  });
});
//@desc clear logged user cart
//@route delete /api/v1/cart
//@access Protected (user)
exports.clearLoggedUserCart = asyncHandler(async (req, res, next) => {
  const Cart = await CartModel.findOneAndDelete({ user: req.user._id });
  res.status(204).json({
    status: "success",
    message: "Cart Cleared successfully",
    data: Cart,
  });
});
//@desc Update specific cart item quantity
//@route Put /api/v1/cart/itemId
//@access Protected (user)
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const Cart = await CartModel.findOne({ user: req.user._id });
  if (!Cart) {
    return next(
      new ApiError(`There is no cart for this user${req.user._id}`, 404)
    );
  }
  const itemIndex = Cart.cartItems.findIndex(
    (cartItem) => cartItem._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const CartItem = Cart.cartItems[itemIndex];
    CartItem.quantity = quantity;
    Cart.cartItems[itemIndex] = CartItem;
  } else {
    return next(
      new ApiError(`There is no item for this id ${req.params.itemId}`, 404)
    );
  }
  calcTOtalCartPrice(Cart);
  Cart.save();
  res.status(200).json({
    status: "success",
    message: "item quantity Updated successfully",
    numOfCartItem: Cart.cartItems.length,
    data: Cart,
  });
});
//@desc Apply Coupon on User Cart
//@route Put /api/v1/cart/applyCoupon
//@access Protected (user)
exports.applyCouponOnCart = asyncHandler(async (req, res, next) => {
  //1 - Get Coupoun pased on coupon name and expired data
  const Coupon = await CouponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!Coupon) {
    return next(new ApiError("Coupon is invalid or expired"));
  }
  // 2- get logged user cart to get total cart price
  const Cart = await CartModel.findOne({ user: req.user._id });
  if (!Cart) {
    return next(
      new ApiError(`There is no cart for this user${req.user._id}`, 404)
    );
  }
  const totalPrice = Cart.totalCartPrice;
  // 3- calculate price after discount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * Coupon.discount) / 100
  ).toFixed(2);
  Cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await Cart.save();

  res.status(200).json({
    status: "success",
    message: "Coupon applied successfully",
    numOfCartItem: Cart.cartItems.length,
    data: Cart,
  });
});
