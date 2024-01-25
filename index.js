const mongoDB = require("./config/mongoAuth");



//*------------------------------------------------------

const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session")
const config = require('./config/config')

mongoDB.conectDB()
app.use(session({secret:config.sessionSecret}))

app.set("view engine","ejs")

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use((req, res, next) => {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Expires', '0');
  next();
});

//------------------- FOR ROUTS --------------------------

const userRouts = require("./routers/user/userRouts")
const admiRout = require("./routers/admin/adminRouts")




app.use("/admin",admiRout)
app.use("/",userRouts)


app.listen(3000, () => {
  console.log("server is runing...");
});
