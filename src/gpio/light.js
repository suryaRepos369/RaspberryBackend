require("dotenv").config();
const axios = require("axios");
//const Light = require("../models/SmartLight");
var GPIO1 = 0;
var GPIO2 = 0;
var GPIO3 = 0;

function pinStatus(pin = 0) {
  console.log("reading the gpio pin status", pin);
  if (pin == 0)
    return [
      { lightNo: 1, state: GPIO1 },
      { lightNo: 2, state: GPIO2 },
      { lightNo: 3, state: 1 },
    ];
  if (pin == 1) return { lightNo: 1, state: GPIO1 };
  if (pin == 2) return { lightNo: 2, state: GPIO2 };
  if (pin == 3) return { lightNo: 3, state: GPIO3 };
  return 0;
}

async function ledControl(data) {
  console.log("from the device:", data);

  var pin = lightToGpio(data.lightNo);

  //!to turn on led
  if (data.state == 1) {
    let a = pinStatus(pin);
    if (a.state) {
      console.log("already On");
    } else {
      //!send data to db make api call
      ledOn(pin);
      console.log("sending data to db");
      let d = {
        lightNo: data.lightNo,
        gpioNo: pin,
        lightState: 1,
        lightOnAt: data.time,
        lightOffAt: "",
        runTime: null,
      };
      try {
        let a = await axios.post("http://localhost:3030/putLightStatus", d);
        //console.log(a.data);
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  //!to turn off led
  else {
    console.log("received data \n:", data);

    if (data.state == 0) {
      let a = pinStatus(pin);

      if (!a.state) {
        ledOff(pin);
        let d = {
          lightNo: data.lightNo,
          gpioNo: pin,
          lightState: 0,
          lightOnAt: "",
          lightOffAt: data.time,
          runTime: null,
        };
        try {
          let a = await axios.post("http://localhost:3030/putLightStatus", d);
          //console.log(a.data);
        } catch (error) {
          console.log(error.message);
        }
        //!send data to db make api call
      } else {
        console.log("already off");
      }
    }
  }
}

async function ledOn(pin) {
  console.log("function to turn on led");
  if (pin == 1) GPIO1 = 1;
  if (pin == 2) GPIO2 = 1;
  if (pin == 3) GPIO3 = 1;
}

async function ledOff(pin) {
  console.log("function to  turn off the led ");
  if (pin == 1) GPIO1 = 0;
  if (pin == 2) GPIO2 = 0;
  if (pin == 3) GPIO3 = 0;
}
function lightToGpio(data) {
  console.log("data:", data);

  if (data == 1) return 4;
  if (data == 2) return 8;
  if (data == 3) return 5;
  if (data == 4) return 6;
  if (data == 5) return 12;
  if (data == 6) return 26;
  if (data == 7) return 12;
}

module.exports = {
  status: pinStatus,
  ledControl: ledControl,
};
