require("../src/db/mongoose");
const User = require("../src/models/user");

//id 627a357a3f7abbc77d614178
// User.findByIdAndUpdate("627a357a3f7abbc77d614178", { age: 27 })
//   .then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 27 });
//   })
//   .then((count) => {
//     console.log(count);
//   })
//   .catch((e) => {
//     console.log(e);
//   });
//using async await method
//let id = "627b2f9ca2479fc3dde06766";
const updateAndCount = async (id, age) => {
  const data = await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({ age: 27 });
  return count;
};

updateAndCount("627a6cf5e00377554cbe69fb", 24)
  .then((count) => {
    console.log(count);
  })
  .catch((e) => {
    console.log(e);
  });
