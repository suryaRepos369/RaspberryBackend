const express = require("express");
const auth = require("../middleware/auth");
const productFilter = require("../middleware/productFilter");
const router = new express.Router();
const Products = require("../models/products");
// ! Total Routes in this user Router file
router.get("/cart/get/:id", auth, async (req, res) => {
  try {
    let id = req.params.id;
    console.log("id:", id);

    const product = await Products.find({ id });
    console.log("product:", product);

    if (!product) {
      throw new Error("file  not found");
    }

    res.send(product);
  } catch (error) {
    res.status(404).send(error.message);
  }
});
router.post("/cart/post", [productFilter, auth], async (req, res) => {
  try {
    const product = await Products.find({ id: req.params.id });
    if (!product) {
      throw new Error("file  not found");
    }

    res.send(product);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// router.post("/users/login", async (req, res) => {
//   // console.log(req.body);

//   try {
//     const user = await User.findByCredentials(
//       req.body.email,
//       req.body.password
//     );
//     console.log(user);

//     // console.log("generating auth token ");
//     const token = await user.generateAuthToken();
//     // console.log("token:", token);

//     res.send({ UserEmail: user.email, TOKEN: token });
//   } catch (e) {
//     res.status(400).send(e.message);
//   }
// });

// router.post("/users/logout", auth, async (req, res) => {
//   try {
//     req.user.tokens = req.user.tokens.filter((token) => {
//       return token.token !== req.token;
//     });
//     await req.user.save();

//     res.send("Logged out ");
//   } catch (e) {
//     res.status(500).send();
//   }
// });

// router.post("/users/logoutAll", auth, async (req, res) => {
//   console.log("deleting all tokens");
//   console.log(req.user);
//   try {
//     req.user.tokens = [];

//     await req.user.save();
//     res.send("All token sessions are logged out ");
//   } catch (e) {
//     res.status(500).send({ Error: e });
//   }
// });

module.exports = router;
