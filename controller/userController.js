const User = require("../model/userModel.js");
const bcrypt = require("bcrypt");
const randomString = require("randomstring")
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

//*----------------------------//-//---------------------------*//

let otp;
let nameResend;
let email2;
// //-----------------------LOGIN INPUT VALIDATION----------------
// function validateEmail(email){
//   var email = email
//   

//   if(emailPattern.test(email)){
//     return true
//   }
//   return false
// }

// //-------------------INPUT VALIDATION----------------------------

// function inputvalidation(name,email,password,confirmPassword){
//   if(name.startsWith(" ")||email.startsWith(" ")||password.startsWith(" ")||confirmPassword.startsWith(" ")){
//     return false;
//   }
//   return true;
// }

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

const loadHome = async (req, res) => {
  try {

    res.render("home", { name: req.session.name });

  } catch (error) {
    console.error(err.massage);
  }
};

//-------------------load login page-------------------------

const loadLogin = async (req, res) => {
  try {
    let regSuccess = req.session.regSuccess;
    res.render("login",{regSuccess});
  } catch (error) {
    console.error(error.message);
  }
};

//--------------------verifying login page--------------------

const verifylogin = async (req, res) => {
  try {

    const email = req.body.email;
    const name = 'User'
    const password = req.body.password;

   
    let emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if(!emailPattern.test(req.body.email)) {
      
      res.json({ logemailPatt: true })
    }else{
     
      const userData = await User.findOne({ email:email });
      if (userData&&userData.is_admin==0) {
        if(userData.is_varified==1){
          const passwordMatch = await bcrypt.compare(password, userData.password);
        if (passwordMatch) {
          if (userData.is_block == 0) {
            req.session.user_id = userData._id;
            req.session.name = userData.name
            req.session.regSuccess = false;
            res.json({success:true})
          } else {
            res.json({blocked:true})
          }
        } else {
  
          res.json({wrong:true})
        }
      } else {
  
        const randomNumber = Math.floor(Math.random() * 9000) + 1000;
        otp = randomNumber;
        req.session.email = req.body.email;
        sendVerifyMail(name, email, randomNumber);
        setTimeout(() => {
          otp = Math.floor(Math.random() * 9000) + 1000;
        }, 60000);
        req.session.verifyErr = true;
        res.json({verify:true})
      } 
    }else{
      res.json({register:true})
    }
        
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

    const name = req.body.name;
    const email = req.body.email;
    const mobile = req.body.number;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (name && name.length <= 2) {
      res.json({ name: true })
      console.log({ name, email, mobile, password, confirmPassword });

    } else { 
      console.log({ name, email, mobile, password, confirmPassword });

      if (email.trim() === "" || mobile.trim() === "" || password.trim() === "" || name.trim() === "" || confirmPassword.trim() === "") {
        res.json({ require: true })
        console.log({ name, email, mobile, password, confirmPassword });

      } else {

        let emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(req.body.email)) {
          res.json({ emailPatt: true })
        } else {
          let mobilePattern = /^\d{10}$/;
          if (!mobilePattern.test(mobile) || mobile === "0000000000") {
            res.json({ mobile: true })
          } else {
            if (password.length < 4) {
              res.json({ password: true })
            } else {

              const emailchek = await User.findOne({ email: req.body.email })
              if (emailchek) {
                res.json({ emailalready: true })
              } else {
                if (password == confirmPassword) {

                  const spassword = await securePassword(req.body.password);
                  const user = new User({

                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.number,
                    password: spassword,
                    is_admin:0,

                  });

                  const userData = await user.save();

                  if (userData) {

                  let randomNumber = Math.floor(Math.random() * 9000) + 1000;
                  otp = randomNumber;

                    req.session.email = req.body.email;
                    req.session.pass = spassword;
                    req.session.userName = req.body.name;
                    req.session.number = req.body.number;

                    sendVerifyMail(req.body.name, req.body.email, randomNumber);
                    setTimeout(() => {
                      otp = Math.floor(Math.random() * 9000) + 1000;
                    }, 60000)
                    req.session.otpsent = true
                    res.json({ success: true })
                  } else {
                    res.json({ notsaved: true })
                  }
                } else {
                  res.json({ wrongpass: true })
                }
              }

            }
          }
        }
      }
    }

  } catch (error) {
    console.error(error);
  }
};

//---------------------OTP loading---------------------------

const otpload = async (req, res) => {
  try {

    let verifyErr = req.session.verifyErr;
    let otpsend = req.session.otpsend

    res.render("otp",{verifyErr,otpsend})
    
    console.log("otp page loaded")

  } catch (error) {
    console.error(error.message)
  }
  
  
}

//---------------------RESEND OTP--------------------------

const resendotp = async(req,res)=>{
  try {
    
    let otpsend = req.session.otpsend
    let verifyErr = req.session.verifyErr
    let email = req.session.email
    let name = "User"
    let randomNumber = Math.floor(Math.random() * 9000) + 1000;
    otp = randomNumber;
    setTimeout(() => {
      otp = Math.floor(Math.random() * 9000) + 1000;
    }, 60000);
    sendVerifyMail(name,email,randomNumber)
    res.render("otp",{verifyErr,otpsend,resend: "Resend the otp to your email address."})


  } catch (error) {
    console.error(error.message)
  }
}

//---------------------OTP Verification----------------------

const verifyOtp = async (req, res) => {
  try {

    req.session.verifyErr = false
    req.session.otpsend = false

    const otpInput = parseInt(req.body.otp)
    const email = req.session.email

    if (otpInput == otp) {
      const verified = await User.updateOne(
        { email: email },
        { $set: { is_varified: 1 } }
      );

      if (verified) {
        console.log("account verified")
        req.session.regSuccess = true;
        res.json({success:true})

      } else {
        console.log("not verified !!")
        res.json({error:true})
      }

    } else {
      res.json({wrong:true})
    }

  } catch (error) {
    console.log(error.message);
  }


};

//-----------------------dashboard loading---------------------

const accountload = async (req, res) => {
  try {

    res.render("userDashboard")

  } catch (error) {
    console.error(error.message)
  }

}

//----------------------logout---------------------------------

const userLogout = async (req, res) => {

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
        ', This message for reset your password. click here to <a href="http://localhost:3000/forget-password?token=' + token + '">Reset</a>your password.</p>,'
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

const loadForget = async (req, res) => {
  try {

    res.render("forgetpage")

  } catch (error) {
    console.error(error.message)
  }
}

//----------------------forgetverify---------------------------

const forgetverify = async (req, res) => {
  try {

    const email = req.body.email
    const userData = await User.findOne({ email: email })
    
    let emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(req.body.email)) {

      res.json({ emailPatt: true })
    }else{
      if (userData) {
      if (userData.is_varified == 1) {

        const random_String = randomString.generate();

        const updatedData = await User.updateOne({ email: email }, { $set: { token: random_String } })

        const user = await User.findOne({ email: email });

        sendPassResetMail(user.name, user.email, random_String)

        res.json({response:true})

      } else {
        res.json({mailverify:true})
        
      }

    } else {
      res.json({wrong:true})
    }
    }
    
  } catch (error) {
    console.error(error.message)
  }
}

//----------------------------------forget password load-------------------

const forgetpasswordload = async (req, res) => {
  try {

    const token = req.query.token;
    console.log(token)
    const tokenData = await User.findOne({ token: token })

    if (tokenData) {

      res.render("forget-password", { user_id: tokenData._id ,email:tokenData.email})

    } else {
      console.log("No token")
      res.status(404).render("404", { message: "Oop's.. Your token is invalid" });
    }

  } catch (error) {
    console.error(error.message)
  }
}

//----------------------------------Reset password--------------

const resetpassword = async (req, res) => {
  try {

    const userPassword = req.body.password
    const user_id = req.body.user_id
    const secure_Password = await securePassword(userPassword)
    const updatedData = await User.findByIdAndUpdate({ _id: user_id }, { $set: { password: secure_Password, token: '' } })

    if(updatedData){
       res.redirect("/")
    }else{
      res.status(404).render(404);
      console.log("pass not reset");
    }
   

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
  resendotp,
  loadHome,
  verifylogin,
  accountload,
  userLogout,
  loadForget,
  forgetverify,
  resetpassword,
  forgetpasswordload,

};
