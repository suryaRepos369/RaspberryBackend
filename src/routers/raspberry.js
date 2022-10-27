const express = require("express");
const router = new express.Router();
const Light = require("../models/SmartLight");

function calcDate(date1, date2) {
  /*
   * calcDate() : Calculates the difference between two dates
   * @date1 : "First Date in the format MM-DD-YYYY"
   * @date2 : "Second Date in the format MM-DD-YYYY"
   * return : Array
   */

  //new date instance
  const dt_date1 = new Date(date1);
  console.log("dt_date1:", dt_date1);
  const dt_date2 = new Date(date2);
  console.log("dt_date2:", dt_date2);

  //Get the Timestamp
  const d1 = dt_date1.getTime();
  const d2 = dt_date2.getTime();
  let diff = (d1 - d2) / 1000;
  console.log("seconds diff:", diff);

  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
  }

  return secondsToHms(diff);
}

// ! Total Routes in this user Router file

router.get("/pinStatus", async (req, res) => {
  try {
    res.status(200).send("All pin up and runnning ");
  } catch (error) {
    res.status(404).send(error.message);
  }
});

router.post("/putLightStatus", async (req, res) => {
  try {
    if (req.body.lightState === 0) {
      let res = await Light.find({ lightState: 1 }).limit(1).sort({ $natural: -1 });
      var rt = calcDate(req.body.lightOffAt, res[0].lightOnAt);
      console.log("rt:", rt);

      try {
        let up = await Light.updateOne(
          { _id: res[0]._id },
          {
            $set: {
              lightOffAt: req.body.lightOffAt,
              runTime: rt,
              lightState: req.body.lightState,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      const lightsStatus = new Light(req.body);
      //console.log("lightsStatus:", lightsStatus);

      try {
        let createdData = await lightsStatus.save();
        console.log("Successfully INSERTED INTO DB ==>",createdData)
        res.status(200).send(createdData);
      } catch (error) {
        res.status(404).send(error.message);
      }
    }
  } catch (error) {
    console.log(error.message);
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
