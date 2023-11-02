const User = require("../model/userModel.js");
const bcrypt = require("bcrypt");
const randomString =require("randomstring")
const otpgenerator = require("otp-generator")
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { name } = require("ejs");
const { Collection } = require("mongoose");
dotenv.config();

//-------------------bcrypt-----------------------------------
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.error(error);
  }
};
//------------------------------//---------------------------//

let otp;
let nameResend;
let email2;
//?-----------------------LOGIN INPUT VALIDATION----------------
function validateEmail(email){
  var email = email
  let emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

  if(emailPattern.test(email)){
    return true
  }
  return false
}

//-------------------INPUT VALIDATION----------------------------

function inputvalidation(name,email,password,confirmPassword){
  if(name.startsWith(" ")||email.startsWith(" ")||password.startsWith(" ")||confirmPassword.startsWith(" ")){
    return false;
  }
  return true;
}

//!------------------for send mail-------------------------------
const sendVerifyMail = async (name, email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "For Mail Verifycation",
      html:
        "<p>Hello " +
        name +
        ", This is your Mail veryfication message <br> This is your OTP :" +
        otp +
        " Please Verify your mail.</p>,"
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email has been sent:- ", info.response);
      }
    });
  } catch (error) {
    console.error(error.message);
  }
};

//-------------------load home page--------------------------

const  loadHome = async (req, res) => {
  try {
    
      res.render("home",{name:req.session.name});
    
  } catch (error) {
    console.error(err.massage);
  }
};

//-------------------load login page-------------------------

const loadLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.error(error.message);
  }
};

//--------------------verifying login page--------------------

const verifylogin = async (req, res) => {
  try {

    const email = req.body.email;
    const password = req.body.password;

    if(!validateEmail(email)){
      return res.render("login",{message:"Invalid email"})
    }

    const userData = await User.findOne({ email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        if (userData.is_varified == 0) {

          res.render("login", { message: "Please verify your email" });
        } else {
          req.session.user_id = userData._id
          req.session.name = userData.name
          res.redirect("/home");
        }
      } else {

        res.render("login", { message: "password in corroct" });
      }
    } else {

      res.render("login", { message: "Account not exist error!" });
    }
  } catch (error) {
    console.error(error.massage);
  }
};

//-------------------load signup page-------------------------

const loadSignup = async (req, res) => {
  try {
    res.render("signup");
  } catch (error) {
    console.error(error.message);
  }
};

//-------------------user registering data--------------------------

const insertuser = async (req, res) => {

  try {

    const name=req.body.name
    const email=req.body.email
    const password=req.body.password
    const confirmPassword=req.body.confirmPassword

    if(!inputvalidation(name,email,password,confirmPassword)){
            
      return res.render('signup',{message:'Dont start with spaces.'})
    }

    const emailchek =  await User.findOne({email:req.body.email})

    if(emailchek){
      res.render("signup",{message:"Account already exist please login"})

    }else{

      if(req.body.password == req.body.confirmPassword){

        const spassword = await securePassword(req.body.password);
        
      const user = new User({
       name: req.body.name,
       email: req.body.email,
       phone: req.body.phone,
       password: spassword,
       confirmPassword: req.body.confirmPassword,
       is_admin: 0,
       is_varified:0
      });

      const userData = await user.save();

      if (userData) {

         otp =otpgenerator.generate(6,{ digits:true, alphabets:false, upperCase:false, specialChars:false})

        sendVerifyMail(req.body.name, req.body.email, otp);

        email2 = req.body.email;
        nameResend = req.body.name;

        res.redirect("/otp");

      } else {

        res.render("signup", { massage: "your registration has been failed" });
      }
         
      }else{
        res.render("signup",{message:"Please confirm your password"})
      }
      
    }
  } catch (error) {
    console.error(error);
  }
};

//---------------------OTP loading---------------------------

const otpload = async(req,res)=>{
  res.render("otp")
  console.log("otp page loaded")
}

//---------------------OTP Verification----------------------

const verifyOtp = async (req, res) => {
  try {
     
    const inputOtp = req.body.otp

    if(inputOtp == otp){
      const updateInfo = await User.updateOne(
      { email:email2 },
      { $set: { is_varified: 1 } }
      );

    if(updateInfo){
      console.log(updateInfo);
      console.log("account verified")
      res.redirect("/login");

    }else{

      console.log("not verified !!")
      res.redirect("/otp")
    }
      
    }else{
      res.render("otp",{message:"Enter the valid OTP"})
    }
   
  } catch (error) {
    console.log(error.message);
  }


};

//-----------------------dashboard loading---------------------

const accountload = async (req,res)=>{
  try {

    res.render("userDashboard")

  } catch (error) {
    console.error(error.message)
  }
  
}

//----------------------logout---------------------------------

const userLogout = async(req,res)=>{

  try {

    req.session.destroy()
    res.redirect("/")

  } catch (error) {
    console.error.message
  }
  
}

//!--------------------------mail sending for recoovery password-------------------

const sendPassResetMail = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "For Reset Password",
      html:
        '<p>Hello ' +
        name +
        ', This message for reset your password. click here to <a href="http://localhost:3000/forget-password?token='+token+'">Reset</a>your password.</p>,'
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email has been sent:- ", info.response);
      }
    });
  } catch (error) {
    console.error(error.message);
  }
};

//-----------------------load Forgetpage--------------------

const loadForget = async(req,res)=>{
  try {
    
    res.render("forgetpage")

  } catch (error) {
    console.error(error.message)
  }
}

//----------------------forgetverify---------------------------

const forgetverify =async(req,res)=>{
  try {
    
    const email = req.body.email
    const userData = await User.findOne({email:email})

    if(userData){
      if(userData.is_varified == 0){
        res.render("forgetpage",{message:"please verify your Email"})

      }else{
        const random_String = randomString.generate();

        const updatedData = await User.updateOne({email:email},{$set:{token:random_String}})

        sendPassResetMail(userData.name,userData.email,random_String)

        res.render("forgetpage",{message:"please check your mail for reset your password"})

      }

    }else{
      res.render("forgetpage",{message:"please enter valid Email"})
    }

  } catch (error) {
    console.error(error.message)
  }
}

//----------------------------------forget password load-------------------

const forgetpasswordload = async(req,res)=>{
  try {
    
    const token = req.query.token;
    console.log(token)
    const tokenData = await User.findOne({token:token})
    
    if(tokenData){

      res.render("forget-password",{user_id:tokenData._id})

    }else{
      res.status(404).render("404",{message:"Oop's.. Your token is invalid"});
    }

  } catch (error) {
    console.error(error.message)
  }
}

//----------------------------------Reset password--------------

const resetpassword = async(req,res)=>{
  try {
    
    const userPassword = req.body.password
    const user_id = req.body.user_id
    const secure_Password = await securePassword(userPassword)
    const updatedData = await User.findByIdAndUpdate({_id:user_id},{$set:{password:secure_Password,token:''}})

    res.redirect("/")

  } catch (error) {
    console.error(error.message)
  }
}

module.exports = {

  loadLogin,
  loadSignup,
  insertuser,
  otpload,
  verifyOtp,
  loadHome,
  verifylogin,
  accountload,
  userLogout,
  loadForget,
  forgetverify,
  resetpassword,
  forgetpasswordload,

};
