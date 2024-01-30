const User = require("../model/userModel.js");
const Products = require("../model/productsModel.js");
const Category = require("../model/categoryModel.js");
const Referal = require("../model/referalModel.js")
const Cart = require("../model/cartModel.js");
const Address = require("../model/addressModel.js");
const Order = require("../model/ordersModel.js");
const Banner = require("../model/bannerModel");
const bcrypt = require("bcrypt");
const randomString = require("randomstring");

const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

//-------------------bcrypt-----------------------------------
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
};

//*----------------------------//-//---------------------------*//

let otp;
let nameResend;
let email2;

//!------------------SEND MAIL FOR EMAIL VERIFICATION-------------------------------
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
        " Please Verify your mail.</p>,",
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email has been sent:- ", info.response);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
};

//------------------- LOAD HOME PAGE -------------------------

const loadHome = async (req, res) => {
  try {
    const products = await Products.find({ blocked: 0 }).limit(10);
    const cart = await Cart.findOne({ userId: req.session.user_id });
    let cartCount = 0;
    if (cart) {
      cartCount = cart.products.length;
    }

    let wishCount = 0;
    if (req.session.user_id) {
      const user = await User.findOne({ _id: req.session.user_id });
      if (user && user.wishlist && user.wishlist.items) {
        wishCount = user.wishlist.items.length;
      }
    }
    const banner = await Banner.find()

    res.render("home", {
      name: req.session.name,
      products: products,
      cartCount,
      wishCount,
      banner,
    });
  } catch (error) {
   console.log(error)
   res.status(500).render("500")
  }
};

//-------------------load login page-------------------------

const loadLogin = async (req, res) => {
  try {
    let regSuccess = req.session.regSuccess;
    res.render("login", { regSuccess });
  } catch (error) {
    console.log(error)
    res.status(500).render("500");
  }
};

//--------------------verifying login page--------------------

const verifylogin = async (req, res) => {
  try {
    const email = req.body.email;
    const name = "User";
    const password = req.body.password;

    if (email.trim() == "") {
      res.json({ email_fillout: true });
    } else {
      if (email.includes(" ") || /\s/.test(email)) {
        res.json({ email_space: true });
      } else {
        let emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(req.body.email)) {
          res.json({ logemailPatt: true });
        } else {
          if (password.trim() == "") {
            res.json({ password_fillout: true });
          } else {
            if (password.includes(" ") || /\s/.test(password)) {
              res.json({ password_space: true });
            } else {
              const userData = await User.findOne({ email: email });
              if (userData && userData.is_admin == 0) {
                if (userData.is_varified == 1) {
                  const passwordMatch = await bcrypt.compare(
                    password,
                    userData.password
                  );
                  if (passwordMatch) {
                    if (userData.is_block == 0) {
                      req.session.user_id = userData._id;
                      req.session.name = userData.name;
                      req.session.regSuccess = false;
                      res.json({ success: true });
                    } else {
                      res.json({ blocked: true });
                    }
                  } else {
                    res.json({ wrong: true });
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
                  res.json({ verify: true });
                }
              } else {
                res.json({ register: true });
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).render("500");
  }
};

//-------------------load signup page-------------------------

const loadSignup = async (req, res) => {
  try {
    res.render("signup");
  } catch (error) {
    console.log(error)
    res.status(500).render("500");
  }
};

// ======--==--====== generate referal code ======--==--======

function generateReferralCode(length) {
  return Math.random().toString(36).substr(2, length).toUpperCase();
}

//-------------------user registering data--------------------------

const insertuser = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const mobile = req.body.number;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    
    

    if (name.trim() === "") {
      res.json({ name_require: true });
    } else {
      if (name.startsWith(" ") || name.includes(" ")) {
        res.json({ name_space: true });
      } else {
        if (name && name.length <= 2) {
          res.json({ name: true });
        } else {
          if (email.trim() === "") {
            res.json({ email_require: true });
          } else {
            if (email.startsWith(" ") || email.includes(" ")) {
              res.json({ email_space: true });
            } else {
              const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
              if (!emailPattern.test(req.body.email)) {
                res.json({ emailPatt: true });
              } else {
                if (mobile.trim() === "") {
                  res.json({ mobile_require: true });
                } else {
                  if (mobile.startsWith(" ") || mobile.includes(" ")) {
                    res.json({ mobile_space: true });
                  } else {
                    let mobilePattern = /^\d{10}$/;
                    if (
                      !mobilePattern.test(mobile) ||
                      mobile === "0000000000"
                    ) {
                      res.json({ mobile: true });
                    } else {
                      if (password.trim() === "") {
                        res.json({ password_require: true });
                      } else {
                        if (
                          password.startsWith(" ") ||
                          password.includes(" ")
                        ) {
                          res.json({ password_space: true });
                        } else {
                          if (password.length < 4) {
                            res.json({ password: true });
                          } else {
                            const alphanumeric = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
                            if (!alphanumeric.test(password)) {
                              res.json({ alphanumeric: true });
                            } else {
                              if (confirmPassword.trim() === "") {
                                res.json({ confirm_require: true });
                              } else {
                                if (
                                  confirmPassword.startsWith(" ") ||
                                  confirmPassword.includes(" ")
                                ) {
                                  res.json({ confirm_space: true });
                                } else {
                                  const emailchek = await User.findOne({
                                    email: req.body.email,
                                  });
                                  if (emailchek) {
                                    res.json({ emailalready: true });
                                  } else {
                                    if (password == confirmPassword) {
                                      const spassword = await securePassword(
                                        req.body.password
                                      );
                                      const user = new User({
                                        name: req.body.name,
                                        email: req.body.email,
                                        phone: req.body.number,
                                        password: spassword,
                                        is_admin: 0,
                                      });

                                      const userData = await user.save();

                                      if (userData) {
                                        const generatedreferralCode = generateReferralCode(6);
                                       
                                        const referal = new Referal({
                                          user: userData._id,
                                          code: generatedreferralCode
                                        });

                                        await referal.save();
                                       
                                        const referalcode = req.body.referalcode;
                                        if(referalcode){
                                           const referalData2 = await Referal.findOne({ code: referalcode });
                                        
                                        if(referalData2){
                                          
                                          await User.findOneAndUpdate({ _id: userData._id }, { $inc: { wallet: 50 } });
                                          await User.findOneAndUpdate({ _id: referalData2.user }, { $inc: { wallet: 100 } });
                                          
                                          await Referal.findOneAndUpdate({code:referalcode},{$push:{usedUsers:userData._id}})
      
                                        }else{
                                          res.json({ wrongreferal: true });

                                        }
                                        }
                                       

                                        let randomNumber =
                                          Math.floor(Math.random() * 9000) +
                                          1000;
                                        otp = randomNumber;

                                        req.session.email = req.body.email;
                                        req.session.pass = spassword;
                                        req.session.userName = req.body.name;
                                        req.session.number = req.body.number;

                                        sendVerifyMail(
                                          req.body.name,
                                          req.body.email,
                                          randomNumber
                                        );
                                        setTimeout(() => {
                                          otp =
                                            Math.floor(Math.random() * 9000) +
                                            1000;
                                        }, 60000);
                                        req.session.otpsent = true;
                                        
                                        
                                        res.json({ success: true });
                                      } else {
                                        res.json({ notsaved: true });
                                      }
                                    } else {
                                      res.json({ wrongpass: true });
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).render("500");
  }
};

//---------------------OTP loading---------------------------

const otpload = async (req, res) => {
  try {
    let verifyErr = req.session.verifyErr;
    let otpsend = req.session.otpsend;

    res.render("otp", { verifyErr, otpsend });

    console.log("otp page loaded");
  } catch (error) {
    console.log(error)
    res.status(500).render("500");
  }
};

//---------------------RESEND OTP--------------------------

const resendotp = async (req, res) => {
  try {
    let otpsend = req.session.otpsend;
    let verifyErr = req.session.verifyErr;
    let email = req.session.email;
    let name = "User";
    let randomNumber = Math.floor(Math.random() * 9000) + 1000;
    otp = randomNumber;
    setTimeout(() => {
      otp = Math.floor(Math.random() * 9000) + 1000;
    }, 60000);
    sendVerifyMail(name, email, randomNumber);
    res.render("otp", {
      verifyErr,
      otpsend,
      resend: "Resend the otp to your email address.",
    });
  } catch (error) {
    console.log(error)
    res.status(500).render("500");
  }
};

//---------------------OTP Verification----------------------

const verifyOtp = async (req, res) => {
  try {
    req.session.verifyErr = false;
    req.session.otpsend = false;

    const otpInput = parseInt(req.body.otp);
    const email = req.session.email;

    if (req.body.otp.trim() === "") {
      res.json({ fill: true });
    } else {
      if (otpInput == otp) {
        const verified = await User.updateOne(
          { email: email },
          { $set: { is_varified: 1 } }
        );

        if (verified) {
          req.session.regSuccess = true;
          res.json({ success: true });
        } else {
          res.json({ error: true });
        }
      } else {
        res.json({ wrong: true });
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).render("500");
  }
};

//----------------------- dashboard loading ---------------------

const accountload = async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.session.user_id });
    let walletAmount;
    let walletHistory;
    if (userData) {
      walletAmount = userData.wallet;
      walletHistory = userData.walletHistory;
      walletHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    const address = await Address.findOne({ user: req.session.user_id });
    let addressData;
    if (address) {
      addressData = address.address;
    }
    const orderData = await Order.find({ userId: req.session.user_id }).sort({
      date: -1,
    });
    const cart = await Cart.findOne({ userId: req.session.user_id });
    let cartCount = 0;
    if (cart) {
      cartCount = cart.products.length;
    }
    const user = await User.findOne({ _id: req.session.user_id });

        let wishCount = 0;
        if (user && user.wishlist) {
            const wishlist = user.wishlist.items;
            wishCount = wishlist ? wishlist.length : 0;
        }
    const banner = await Banner.find();
    const referalData = await Referal.findOne({ user: req.session.user_id });
    res.render("userDashboard", {
      orderData,
      cartCount,
      userData,
      addressData,
      walletAmount,
      walletHistory,
      wishCount,
      banner,
      referalData
    });
  } catch (error) {
    console.log(error)
    res.status(500).render("500");
  }
};

//----------------------logout---------------------------------

const userLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.log(error)
    res.status(500).render("500");
  }
};

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
        "<h2>Hello " +
        name +
        '. <br> This message for reset your password. <br> <strong>click here to <a href="http://localhost:3000/forget-password?token=' +
        token +
        '">Reset</strong ></a> your password.</h2>,',
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
        res.status(500).render("500");
      } else {
        console.log("Email has been sent:- ", info.response);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
};

//-----------------------load Forgetpage--------------------

const loadForget = async (req, res) => {
  try {
    res.render("forgetpage");
  } catch (error) {
    console.log(error)
    res.status(500).render("500");
  }
};

//----------------------forgetverify---------------------------

const forgetverify = async (req, res) => {
  try {
    const email = req.body.email;

    if (email.trim() === "") {
      res.json({ email_require: true });
    } else {
      if (email.startsWith(" ") || email.includes(" ")) {
        res.json({ email_space: true });
      } else {
        let emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
          res.json({ emailPatt: true });
        } else {
          const userData = await User.findOne({ email: email });

          if (userData) {
            if (userData.is_varified == 1) {
              const random_String = randomString.generate();

              await User.updateOne(
                { email: email },
                { $set: { token: random_String } }
              );

              const user = await User.findOne({ email: email });

              sendPassResetMail(user.name, user.email, random_String);

              res.json({ response: true });
            } else {
              res.json({ mailverify: true });
            }
          } else {
            res.json({ wrong: true });
          }
        }
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).render("500");
  }
};

//----------------------------------forget password load-------------------

const forgetpasswordload = async (req, res) => {
  try {
    const token = req.query.token;
    const tokenData = await User.findOne({ token: token });

    if (tokenData) {
      req.session.email = tokenData.email;
      res.render("forget-password");
    } else {
      console.log("No token");
      res
        .status(404)
        .render("404", { message: "Oop's.. Your token is invalid" });
    }
  } catch (error) {
    console.log(error)
    res.status(500).render("500");
  }
};

//----------------------------------Reset password--------------

const resetpassword = async (req, res) => {
  try {
    const Password = req.body.password;
    const confirm = req.body.confirm;

    if (Password.trim() === "") {
      res.json({ password_require: true });
    } else {
      if (Password.startsWith(" ") || Password.includes(" ")) {
        res.json({ password_space: true });
      } else {
        const alphanumeric = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
        if (!alphanumeric.test(Password)) {
          res.json({ password: true });
        } else {
          if (Password.length < 4) {
            res.json({ passlength: true });
          } else {
            if (confirm.trim() === "") {
              res.json({ confirm_require: true });
            } else {
              if (confirm.startsWith(" ") || confirm.includes(" ")) {
                res.json({ confirm_space: true });
              } else {
                if (Password !== confirm) {
                  res.json({ wrong: true });
                } else {
                  console.log(req.body.email);

                  const email = req.session.email;

                  const secure_Password = await securePassword(Password);
                  const updatedData = await User.updateOne(
                    { email: email },
                    { $set: { password: secure_Password, token: "" } }
                  );
                  if (updatedData) {
                    req.session.email = false;
                    res.json({ response: true });
                  } else {
                    res.status(404).render(404);
                  }
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).render("500");
  }
};

//---------------------- SEARCH PRODUCTS SHOPE ------------------------
const searchProduct = async (req, res) => {
  try {
    const category = await Category.find({ blocked: 0 });
    const name = req.query.q;
    const regex = new RegExp(`^${name}`, "i");

    const cart = await Cart.findOne({ userId: req.session.user_id });
    let cartCount = 0;
    if (cart) {
      cartCount = cart.products.length;
    }
    const user = await User.findOne({ _id: req.session.user_id });

        let wishCount = 0;
        if (user && user.wishlist) {
            const wishlist = user.wishlist.items;
            wishCount = wishlist ? wishlist.length : 0;
        }

    const products = await Products.find({
      name: { $regex: regex },
      blocked: 0,
    });
    const count = await Products.find({
      name: { $regex: regex },
      blocked: 0,
    }).count();
    res.render("productspage", {
      products: products,
      category,
      count,
      name: req.session.name,
      cartCount,
      totalPages: 0,
      wishCount,
    });
  } catch (error) {
    console.log(error)
    res.status(500).render("500");
  }
};

//-------------------------FILTER PRODUCTS-----------------

const filterProducts = async (req, res) => {
  try {
    const cate = req.body.category;
    const priceSort = parseInt(req.body.price);
    const category = await Category.find({ blocked: 0 });
    let filtered;
    let count;
    const cart = await Cart.findOne({ userId: req.session.user_id });
    let cartCount = 0;
    if (cart) {
      cartCount = cart.products.length;
    }
    const user = await User.findOne({ _id: req.session.user_id });

    let wishCount = 0;
    if (user && user.wishlist) {
        const wishlist = user.wishlist.items;
        wishCount = wishlist ? wishlist.length : 0;
    }
    if (req.body.category == "allCate") {
      filtered = await Products.find({ blocked: 0 }).sort({ price: priceSort });
      count = await Products.find({ blocked: 0 }).count();
    } else {
      filtered = await Products.find({ category: cate, blocked: 0 }).sort({
        price: priceSort,
      });
      count = await Products.find({ category: cate, blocked: 0 }).count();
    }

    res.render("productspage", {
      category,
      count,
      name: req.session.name,
      products: filtered,
      cartCount,
      totalPages: 0,
      wishCount,
    });
  } catch (error) {
    console.log(error)
    res.status(500).render("500");
  }
};

//------------------------EDIT PROFILE IN PROFILE-------------------

const editingProfile = async (req, res) => {
  try {
    const updated = await User.updateOne(
      { _id: req.session.user_id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.number,
        },
      }
    );
    if (updated) {
      res.json({ success: true });
    }
  } catch (error) {
    console.log(error)
    res.status(500).render("500");
  }
};

//-------------------------CHANGING PASSWORD IN PROFILE--------------------

const changePassword = async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.session.user_id });
    const passwordMatch = await bcrypt.compare(
      req.body.currPass,
      userData.password
    );
    if (passwordMatch) {
      const newpassSame = await bcrypt.compare(
        req.body.newPass,
        userData.password
      );
      if (newpassSame) {
        res.json({ newPassSame: true });
      } else {
        const securePass = await securePassword(req.body.newPass);
        await User.updateOne(
          { _id: req.session.user_id },
          { $set: { password: securePass } }
        );
        res.json({ changed: true });
      }
    } else {
      res.json({ wrongpass: true });
    }
  } catch (error) {
    console.log(error)
    res.status(500).render("500");
  }
};

//---------------------CHECKOUT PAGE LOADING--------------

const loadCheckoutpage = async (req, res) => {
  try {
    const session = req.session.user_id;

    const address = await Address.findOne({ user: req.session.user_id });
    let addressData;
    if (address) {
      addressData = address.address;
    }
    const userData = await User.findOne({ _id: req.session.user_id });
    const cartData = await Cart.findOne({
      userId: req.session.user_id,
    }).populate("products.productId");
   

    const products = cartData.products;
    const cart = await Cart.findOne({ userId: req.session.user_id });
    let cartCount = 0;
    if (cart) {
      cartCount = cart.products.length;
    }

    const user = await User.findOne({ _id: req.session.user_id });

        let wishCount = 0;
        if (user && user.wishlist) {
            const wishlist = user.wishlist.items;
            wishCount = wishlist ? wishlist.length : 0;
        }
    let total = 0;
    for (let i = 0; i < products.length; i++) {
      total += products[i].totalPrice;
    }
    let stock = [];
    let countCart = [];

    for (let i = 0; i < products.length; i++) {
      stock.push(cartData.products[i].productId.quantity);
      countCart.push(cartData.products[i].count);
    }
    let inStock = true;
    let proIndex = 0;

    for (let i = 0; i < stock.length; i++) {
      if (stock[i] > countCart[i] || stock[i] == countCart[i]) {
        inStock = true;
      } else {
        inStock = false;
        proIndex = i;
        break;
      }
    }

    const proName = cartData.products[proIndex].productId.name;
    if (req.session.user_id) {
      if (inStock === true) {
        const Total = total;
        const totalamount = total;
        const userId = userData._id;

        res.render("checkoutPage", {
          products: products,
          Total: Total,
          userId,
          session,
          totalamount,
          addressData,
          userData,
          cartCount,
          wishCount,
          name: req.session.name,
        });
      } else {
        res.render("cartLoad", {
          message: proName,
          cartCount,
        });
      }
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error)
    res.status(500).render("500");
  }
};

//----------BLOG PAGE LOAD------------
const loadBlog = async (req, res) => {
  try {
    let wishCount = 0;
    if (req.session.user_id) {
      const user = await User.findOne({ _id: req.session.user_id });
      if (user && user.wishlist && user.wishlist.items) {
        wishCount = user.wishlist.items.length;
      }
    }
    const cart = await Cart.findOne({ userId: req.session.user_id });
    let cartCount = 0;
    if (cart) {
      cartCount = cart.products.length;
    }
    res.render("blog", { name: req.session.name, cartCount, wishCount });
  } catch (error) {
    console.log(error)
    res.status(500).render("500");
  }
};

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
  searchProduct,
  filterProducts,
  editingProfile,
  changePassword,
  loadCheckoutpage,
  loadBlog,
};
