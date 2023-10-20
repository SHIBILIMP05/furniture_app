const User = require("../model/userModel.js")
const bcrypt = require("bcrypt")

//-------------------bcrypt-----------------------------------
const securePassword = async(password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;

    } catch (error) {
        console.error(error)
    }
}

//-------------------load login page--------------------------
const loadLogin = async(req,res)=>{
    try {
        res.render("login")
    } catch (error) {
        console.error(error)
    }
}

//-------------------load signup page--------------------------
const loadSignup = async(req,res)=>{
    try {
        res.render("signup")
    } catch (error) {
        console.error(error)
    }
}

//-------------------user registering data--------------------------
const insertuser = async(req,res)=>{
    try {
        const spassword = await securePassword(req.body.password)
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            password:spassword,
            confirmPassword:req.body.confirmPassword,
            is_admin:0
        })

        const userData = await user.save()

        if(userData){
            res.render("registerd",{message:"you are successfully registered"})
        }else{
            res.render("registerd",{massage:"your registration has been failed"})
        }


    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    loadLogin,
    loadSignup,
    insertuser
}