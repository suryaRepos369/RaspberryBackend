const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");
require("dotenv").config();

//console.log("secret string is :", process.env.JWT_STR);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot contain "password"');
        }
      },
    },
    avatar: {
      type: Buffer,
      required: false,
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a postive number");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});
userSchema.virtual("check", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject._id;
  //delete userObject.age;
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.__v;
  delete createdAt;
  delete updatedAt;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  try {
    const token = await jwt.sign(
      {
        _id: user._id.toString(),
      },
      process.env.JWT_STR,
      { expiresIn: "24h" }
    );
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
    next();
  } catch (e) {
    console.log({ Error: e });
  }
};

userSchema.statics.findByCredentials = async (mail, password) => {
  //console.log("mail:", mail);
  const user = await User.findOne({ email: mail });
  //
  //console.log("user:", user);

  if (!user) {
    throw new Error("credentials not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("credentials doest match");
  }
  return user;
};

// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// Delete user tasks when user is removed
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
