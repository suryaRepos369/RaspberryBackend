const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
  },
});

const Products = mongoose.model("Cart", cartSchema);

module.exports = Cart;
