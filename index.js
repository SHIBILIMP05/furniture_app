const mongoDB = require("./config/mongoAuth");


//*------------------------------------------------------

const express = require("express");
const path = require("path");
const app = express();

mongoDB.conectDB()

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Expires', '0');
  next();
});

//------------------- FOR ROUTS --------------------------

const userRouts = require("./routers/user/userRouts")
const admiRout = require("./routers/admin/adminRouts")




app.use("/",userRouts)
app.use("/admin",admiRout)


app.listen(3000, () => {
  console.log("server is runing...");
});
