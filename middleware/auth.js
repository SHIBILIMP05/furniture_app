const User = require("../model/userModel")

// const isLogin = async (req, res, next) => {
//   try {
//     if (req.session.user_id) {
//       const blockUser = await User.findOne({_id:req.session.user_id})
//       if(blockUser.is_block == 0){
//         next();
//       }else {
//         req.session.user_id = false;
//         req.session.name = false;
//       res.redirect("/");
//     }
//   }  
   
//   }catch (error) {
//     console.error(error.message);
//   }
// };+*+
const isLogin = async (req, res, next) => {
  try {
    if (req.session.user_id) {
      console.log(req.session.user_id);
      const user = await User.findOne({ _id: req.session.user_id });

      if (user && user.is_block === 0) {
        next();
      } else {
        

        
        let regSuccess = false
        res.render('login', { isBlocked: true, regSuccess}); 
      }
    } else {
      
      res.redirect("/");
    }
  } catch (error) {
    console.error(error.message);
    res.redirect("/");
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.session.user_id) {
      res.redirect("/home");
    } else {
      next();
    }
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  isLogin,
  isLogout,
};

