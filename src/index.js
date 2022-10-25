const express = require("express");
const hbs = require("hbs");
const raspberryRouter = require("./routers/raspberry");
const path = require("path");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const port = process.env.PORT || 3030;
require("./db/mongoose");
const light = require("./gpio/light");
const publicDirectoryPath = path.join(__dirname, "./templates");
const viewPath = path.join(__dirname, "./templates/views");

app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(raspberryRouter);
app.set("view engine", "hbs");
app.set("views", viewPath);
app.get("", (req, res) => {
  res.render("home");
});

app.get("*", (req, res) => {
  res.status(404).send("Invalid URL");
});

//!listening the port 3030

server.listen(port, () => {
  console.log("server running on port ", port);
});

io.on("connection", async (socket) => {
  //!initial pin status  check up while a new device is connected
  let readState = light.status();
  console.log('readState:', readState)

  console.log("led status:", readState);
  console.log("device connected", socket.id);
  io.emit("status", readState);

  socket.on("disconnect", () => {
    console.log(socket.id, "device disconnnected");
  });

  socket.on("sendlightData", (data) => {
    light.ledControl(data);
    console.log('STATE BEFORE SENDING',light.status(data.lightNo))
    io.emit("status", light.status(data.lightNo));
  });

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
});
