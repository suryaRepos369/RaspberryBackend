const bcrypt = require("bcryptjs");
const pwd = "surya123";
const check = bcrypt
  .hash(pwd, 2)
  .then((check) => {
    console.log(check);
  })
  .catch((e) => {
    console.log(e);
  });
// const func = async (resol, reject) => {

//     const isOkay = await bcrypt.hash()
// }
