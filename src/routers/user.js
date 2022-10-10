const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = new express.Router();
const upload = require("../middleware/multer");
const sharp = require("sharp");
const newCheck = require("../middleware/newUserCheck");
// ! Total Routes in this user Router file
//  /users/all
//  /users/signup
//  /users/login
//  /users/logout
//  /users/logoutAll
//  /users/me            allowed updates get patch delete
//  /users/me/avatar      get post and delete

var startTimer, timer;
let startTime = new Date();

setInterval(myTimer, 1000);
var t = 0;
function myTimer() {
  const d = new Date();
  t++;

  startTimer = startTime.toLocaleTimeString();
}
router.get("/timer", async (req, res) => {
  try {
    res.send({ startTimer, timer: t });
  } catch (e) {
    res.send(e);
  }
});

router.get("/users/all", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (e) {
    res.send(e);
  }
});

router.post("/users/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    let createdData = await user.save();
    console.log("createdData:", createdData);
    const token = await createdData.generateAuthToken();
    console.log("token:", token);

    res.status(200).send({ UserEmail: createdData.email, TOKEN: token });
  } catch (error) {
    if (error.code === 11000) {
      res.status(422).send("Email already exists ");
    } else {
      res.send("Error " + JSON.stringify(error));
    }
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    // console.log("token:", token);

    res.send({ UserEmail: user.email, TOKEN: token });
  } catch (e) {
    console.log(e.message);
    res.status(400).send(e.message);
  }
});

router.get("/users/logout", auth, async (req, res) => {
  try {
    let token = req.token;
    let id = req.user._id;
    console.log("token:", token);
    const user1 = await User.updateOne({ _id: id }, { $pull: { tokens: { token } } });
    console.log("user1:", user1);
    const u = await User.findOne({ _id: id });
    console.log("user after logout :", u);

    res.status(200).send({ message: "User logged out successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).send({ Error: "Error deleting the session token" });
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  console.log("deleting all tokens");
  console.log(req.user);
  try {
    req.user.tokens = [];

    await req.user.save();
    res.send("All token sessions are logged out ");
  } catch (e) {
    res.status(500).send({ Error: e });
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "gr", "password", "age"];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    s;
    res.status(500).send();
  }
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send("file uploaded");
  },
  (error, req, res, next) => {
    res.status(400).send("Error:" + error.message);
  }
);
router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send("avatar deleted");
});
// serving file to the user
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error("file or users not found");
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// router.get("*", (req, res) => {
//   res.status(404).send("Invalid URL");
// });
module.exports = router;
