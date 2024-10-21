const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please Provide Name Of User"],
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [100, "Name is too large"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Please Provide Email Address"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please Provide Password"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    passwordbeforeHash: {
      type: String,
      required: [true, "Please Provide Password"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    passwordChangedAt: Date,
    phone: String,
    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },
    profileImage: String,
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalcode: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const setImageUrl = (doc) => {
  //return image base URL + image path
  if (doc.profileImage) {
    const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImage}`;
    doc.profileImage = imageUrl;
  }
};
// GET & Update
userSchema.post("init", (doc) => {
  setImageUrl(doc);
});
// Create
userSchema.post("save", (doc) => {
  setImageUrl(doc);
});

const UserModel = new mongoose.model("User", userSchema);
module.exports = UserModel;
