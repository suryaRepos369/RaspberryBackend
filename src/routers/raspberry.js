const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();
const Raspberry = require("../models/raspberry");
// ! Total Routes in this user Router file
router.get("/cpu", async (req, res) => {
  try {
    const data = await Raspberry.find().limit(1).sort({ $natural: -1 });
    res.send(data);
  } catch (error) {
    res.status(404).send(error.message);
  }
});
router.post("/putcpudetail", async (req, res) => {
  const data = new Raspberry(req.body);
  try {
    let d = await data.save();

    res.send(d);
  } catch (error) {
    res.status(404).send(error.message);
  }
});
module.exports = router;
