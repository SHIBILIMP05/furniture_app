const mongoDB = require("./config/mongoAuth");
mongoDB.mongoDB()

//*------------------------------------------------------

const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));

//?----- for user routs ---------------------------------

const userRouts = require("./routers/user/userRouts")
const admiRout = require("./routers/admin/adminRouts")
app.use("/",userRouts)
app.use("/",admiRout)

app.listen(3000, () => {
  console.log("server is runing...");
});
