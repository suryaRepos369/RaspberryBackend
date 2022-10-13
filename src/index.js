const express = require("express");
//require("./db/mongoose");
const hbs = require("hbs");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const productRouter = require("./routers/products");
const cartRouter = require("./routers/Cart");
const raspberryRouter = require("./routers/raspberry");
const path = require("path");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 3030;

const publicDirectoryPath = path.join(__dirname, "./templates");
const viewPath = path.join(__dirname, "./templates/views");
// app.use((req, res, next) => {res.status(503).send('Site is currently down. Check back soon!')})

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.static(publicDirectoryPath));
app.use(express.json());
//app.use([userRouter, taskRouter, raspberryRouter, productRouter, cartRouter]);
// app.use(userRouter);
// app.use(taskRouter);
// app.use(productRouter);

app.set("view engine", "hbs");
app.set("views", viewPath);
app.get("", (req, res) => {
  res.render("home");
});

app.get("/switch",(req,res)=>{
res.render("switch")
})


app.get("*", (req, res) => {
  res.status(404).send("Invalid URL");
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
