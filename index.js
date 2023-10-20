const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/furniture");

//*------------------------------------------------------

const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));

//?----- for user routs ---------------------------------

const userRouts = require("./routers/userRouts")
app.use("/",userRouts)
 

app.listen(3000, () => {
  console.log("server is runing...");
});
