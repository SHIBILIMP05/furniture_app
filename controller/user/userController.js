const User = require("../../model/userModel.js")
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
dotenv.config();

//-------------------bcrypt-----------------------------------
const securePassword = async(password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;

    } catch (error) {
        console.error(error)
    }
}

//!------------------for send mail-------------------------------
const sendVerifyMail = async(name,email,user_id)=>{
    try {

        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:process.env.EMAIL,
                pass:process.env.PASS,
            }
        })
        const mailOptions = {
            from:process.env.EMAIL,
            to:email,
            subject:'For Mail Verifycation',
            html:'<p>Hi..'+name+', Please click here to  <a href="http://localhost:3000/verify?id='+user_id+'"> Verify </a> your mail.</p>'
        }

        transporter.sendMail(mailOptions,function(err,info){
            if(err){
                console.log(err)
            }else{
                console.log("Email has been sent:- ",info.response);
            }
        })
    
    } catch (error) {
        console.error(error.message)
    }

}

//-------------------load home page--------------------------

const loadHome =  async(req,res)=>{
    try {
        
        res.render("home")

    } catch (error) {
        console.error(err.massage)
    }
}
 
//-------------------load login page-------------------------

const loadLogin = async(req,res)=>{
    try {
        res.render("login")
    } catch (error) {
        console.error(error.message)
    }
}

//--------------------verifying login page--------------------

const verifylogin = async(req,res)=>{
    try {
        const email = req.body.email
        const password = req.body.password

        const userData = await User.findOne({email})

        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.pass)
            if(passwordMatch){
                if(is_varified === 0){
                    res.render("login",{message:"Please verify your email"})
                }else{
                    res.render("home",{message:"Home Page"})
                }

            }else{
                res.render("login",{message:"password in corroct"})
            }

        }else{
            res.render("login",{message:"Account not exist !"})
        }
        
    } catch (error) {
        console.error(error.massage)
    }
}

//-------------------load signup page-------------------------

const loadSignup = async(req,res)=>{
    try {
        res.render("signup")
    } catch (error) {
        console.error(error.message)
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

            sendVerifyMail(req.body.name, req.body.email,userData._id);

            res.render("signup",{message:"you are successfully registered"})
        }else{
            res.render("signup",{massage:"your registration has been failed"})
        }


    } catch (error) {
        console.error(error)
    }
}

const verifyMail = async(req,res)=>{

    try {

        const updateInfo = await User.updateOne({_id:req.query.id},{$set:{is_varified:1} })
        
        console.log(updateInfo)
        res.render("email-verified")
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    loadLogin,
    loadSignup,
    insertuser,
    verifyMail,
    loadHome,
    verifylogin
}