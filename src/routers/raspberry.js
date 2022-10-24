const express = require("express");
const router = new express.Router();
const Light = require("../models/SmartLight");

// ! Total Routes in this user Router file

router.get("/pinStatus", async (req, res) => {
  try {
    res.status(200).send("All pin up and runnning ");
  } catch (error) {
    res.status(404).send(error.message);
  }
});
router.post("/putLightStatus", async (req, res) => {
  // console.log(req.body);
  const lightsStatus = new Light(req.body);

  try {
    let pinId = req.body.lightNo;
    console.log("pinId:", pinId);
  } catch (e) {}
  try {
    let createdData = await lightsStatus.save();
    res.status(200).send(createdData);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

module.exports = router;

// const user = new User(req.body);

//   try {
//     let createdData = await user.save();
//     console.log("createdData:", createdData);
//     const token = await createdData.generateAuthToken();
//     console.log("token:", token);

//     res.status(200).send({ UserEmail: createdData.email, TOKEN: token });
//   } catch (error) {
//     if (error.code === 11000) {
//       res.status(422).send("Email already exists ");
//     } else {
//       res.send("Error " + JSON.stringify(error));
//     }
//   }
