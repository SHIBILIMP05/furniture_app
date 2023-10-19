const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/furniture");

//------------------------------------------------------

const express = require("express");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.set("views", "./views/user");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.listen(3000, () => {
  console.log("server is runing...");
});
