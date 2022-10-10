require("../src/db/mongoose");
const Task = require("../src/models/task");
//id 627a8ad9f6dec1d84acd848f
//promise chain
//remove by id and print the incomplete tasks
Task.findByIdAndDelete("627a8ad9f6dec1d84acd848f")
  .then((user) => {
    console.log(user);
    return Task.countDocuments({ status: false }).then((count) => {
      console.log(count);
    });
  })
  .catch((e) => {
    console.log(e);
  });
