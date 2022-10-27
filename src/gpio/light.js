require("dotenv").config();
const axios = require("axios");
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED14 = new Gpio(14, 'out');
var LED15 = new Gpio(4, 'out');
var LED16 = new Gpio(15, 'out');

function pinStatus(pin = 0) {
  let g14 = LED14.readSync()
  let g15 = LED15.readSync()
  let g16 = LED16.readSync()
  if (pin == 0){
console.log("Default initial checking ALL PINS STATE")
    return [
      { lightNo: 3, state: g16},
      { lightNo: 2, state: g15 },
      { lightNo: 1, state: g14 },
    ];}
  if (pin == 3) return { lightNo: 3, state: g16 };
  if (pin == 2) return { lightNo: 2, state: g15 };
  if (pin == 1) return { lightNo: 1, state: g14 };
 
}

async function ledControl(data) {
  console.log("Request from the device  ::", data);

  
  //!to turn on led
  if (data.state === 1) 
  {
    let a = pinStatus(data.lightNo);
    console.log('pin status',a)
    if (a.state) {
      console.log("already On");
    } else {
      //!send data to db make api call
     if( ledOn(data.lightNo))
{
  console.log("sending data to db");
      let d = {
        lightNo: data.lightNo,
        gpioNo: 25,
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
else{
  
  console.log("error turning on led ")
  }
      
    }
  }

  //!to turn off led
  else {
    console.log("received data \n:", data);
      let a = pinStatus(data.lightNo);
      if (a.state) {
        if(ledOff(data.lightNo))
        {
           //!send data to db make api call
          console.log("Sending led off data to db")
          let d = {
          lightNo: data.lightNo,
          gpioNo: 25,
          lightState: 0,
          lightOnAt: "",
          lightOffAt: data.time,
          runTime: null,
                  };
        try 
        {
          let a = await axios.post("http://localhost:3030/putLightStatus", d);
          //console.log(a.data);
        } 
        catch (error) 
        {
          console.log(error.message);
        }
  
       }
       else
       {
         console.log("error turning off led")
      } 
       
       
      
       
      
      
      
    }
  }
}

async function ledOn(pin)
 {
  console.log("function to turn on led pin ",pin);
  
    if (pin === 1)
     {
    LED14.writeSync(1)
let a = pinStatus(1)
if(a.state===1)
return true
else
return false
    }
    
    
    if (pin === 2)
     {
    LED15.writeSync(1)
let a = pinStatus(2)
if(a.state===1)
return true
else
return false    


}
 if (pin === 3)
     {
    LED16.writeSync(1)
let a = pinStatus(3)
if(a.state===1)
return true
else
return false    


}













  
}
 

async function ledOff(pin)
 {
  console.log("function to turn off led pin ",pin);
  
    if (pin === 1)
     {
    //if(LED14.readSync==1)
    LED14.writeSync(0)
    let a = pinStatus(1)
if(a.state===0)
return true
else
return false
   
     
    }
    
    if (pin === 2)
     {
    //if(LED15.readSync==1)
    LED15.writeSync(0)
    let a = pinStatus(2)
if(a.state===0)
return true
else
return false
   
    }
    
    if (pin === 3)
     {
    //if(LED15.readSync==1)
    LED16.writeSync(0)
    let a = pinStatus(3)
if(a.state===0)
return true
else
return false
   
    }
  
}



 


module.exports = {
  status: pinStatus,
  ledControl: ledControl,
}
