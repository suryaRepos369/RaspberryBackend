const axios = require("axios");
async function getFirebaseData() {
  try {
    let res = await axios.get("https://auth-develeopement-default-rtdb.firebaseio.com/posts.json");
    // let res = await axios.post("https://auth-develeopement-default-rtdb.firebaseio.com/posts.json", {
    //   name: "priyadharshini",
    // });
    // a.map((data)=>{
    //     console.log(data)
    // })

    console.log("res:", res.data);
    let kes = Object.values(res.data);
    console.log("kes:", kes);
    kes.map((data) => {
      console.log(data.name);
    });
  } catch (error) {
    console.log("error:", error);
  }
}

getFirebaseData();
