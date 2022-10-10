require("../src/db/mongoose");
const Task = require("../src/models/task");
//const argv = require("yargs").argv;
let id = "627b31d65081c1b890d26c7b";
const deleteAndCount = async (id) => {
  const delet = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ status: false });
  return count;
};

deleteAndCount(id)
  .then((user) => {
    console.log(user);
  })
  .catch((e) => {
    console.log(e);
  });
