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
  let a = await fetch("http://localhost:3030/pinStatus");
  console.log(a.data);

  console.log("device connected", socket.id);
  io.emit("status", { pin: 4, status: 1, time: "18/10/2022, 09:37:24" });
  socket.on("disconnect", () => {
    console.log(socket.id, "device disconnnected");
  });

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`Userwith socket id ${socket.id} has joined room ${data}`);
  });
  socket.on("sendPinData", (data) => {
    console.log(`Userwith socket id ${socket.id} has sent data :: ${JSON.stringify(data)}`);
    io.emit("status", data);
  });
  0;

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
});
