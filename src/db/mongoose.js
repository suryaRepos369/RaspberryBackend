require("dotenv").config();
const mongoose = require("mongoose");

let uri = process.env.MONGODB_URI;
console.log("uri:", uri);

// });
var db = mongoose.connection;

db.on("error", (err) => {
  console.log("Connection disconnected Please Reconnect:", err.message);
});

db.on("connecting", function () {
  console.log("connecting to MongoDB...");
});

db.on("connected", function () {
  console.log("MongoDB connected!");
});
db.on("reconnected", function () {
  console.log("MongoDB reconnected!");
});
db.on("disconnected", function () {
  console.log("MongoDB disconnected!");
  setTimeout(() => {
    mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 3000,
      })
      .catch((error) => {
        console.log("Error Connecting to DB:", error.message);
      });
  }, 5000);
});
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .catch((error) => {
    console.log("Error Connecting to DB:", error.message);
  });
