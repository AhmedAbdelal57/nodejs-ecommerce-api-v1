const userRoutes = require("./user/userRoutes");
const authRoutes = require("./user/authRoutes");
const categoryRoutes = require("./categoryRoutes");
const subCategoryRoutes = require("./subCategoryRoutes");
const brandRoutes = require("./brandRoutes");
const productRoutes = require("./productRoutes");
const reviewRoutes = require("./reviewRoutes");
const wishlistRoutes = require("./wishlistRoutes");
const addressRoutes = require("./addressRoutes");
const couponRoutes = require("./couponRoutes");
const cartRoutes = require("./cartRoutes");

//Mount Routes
const mountRoutes = (app) => {
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/categories", categoryRoutes);
  app.use("/api/v1/subCategories", subCategoryRoutes);
  app.use("/api/v1/brands", brandRoutes);
  app.use("/api/v1/products", productRoutes);
  app.use("/api/v1/reviews", reviewRoutes);
  app.use("/api/v1/wishlist", wishlistRoutes);
  app.use("/api/v1/addresses", addressRoutes);
  app.use("/api/v1/coupons", couponRoutes);
  app.use("/api/v1/cart", cartRoutes);
};

module.exports = mountRoutes;
