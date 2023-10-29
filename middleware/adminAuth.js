const isLogin = async (req, res, next) => {
  try {
    if (req.session.user_id) {
      next();
    } else {
      res.redirect("/admin");
    }
    
  } catch (error) {
    console.error(error.message);
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.session.user_id) {
      res.redirect("/admin/home");
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