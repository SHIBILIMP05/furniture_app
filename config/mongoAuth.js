const mongoose = require("mongoose")

let dotenv = require("dotenv")
dotenv.config()

module.exports = {

    conectDB:()=>{

        mongoose.connect(process.env.Mongo_url,{

        }).then(()=>{
            console.log("database connected..")
        }).catch((err)=>{
            console.log(err)
        })
    }
}