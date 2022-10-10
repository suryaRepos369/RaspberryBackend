const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
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
});

const Products = mongoose.model("Products", productSchema);

module.exports = Products;
