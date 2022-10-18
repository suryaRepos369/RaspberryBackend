const express = require("express");
const router = new express.Router();
// ! Total Routes in this user Router file

router.get("/pinStatus", async (req, res) => {
  try {
    res.status(200).send("All pin up and runnning ");
  } catch (error) {
    res.status(404).send(error.message);
  }
});
module.exports = router;
