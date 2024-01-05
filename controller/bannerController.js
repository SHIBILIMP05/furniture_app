const Banner = require("../model/bannerModel");

//----------------------LOAD BANNER PAGE -------------------
const loadBanner = async (req, res, next) => {
  try {
    const banner = await Banner.find();
    res.render("banner", { banner });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//---------------------- LOAD ADD BANNER PAGE -------------------

const loadAddBanner = async (req, res, next) => {
  try {
    res.render("addBanner");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//------------- ADD BANNER -------------------
const addBanner = async (req, res, next) => {
    try {
       
      const image = req.file ? req.file.filename : undefined;
        
      const title = req.body.title;
      const description = req.body.description;
  
      if (image === undefined) {
          res.json({ imageIssue: true });
      } else {
          const banner = await Banner.findOne({ title: title });
          if (banner) {
              res.json({ exist: true });
          } else {
              const data = new Banner({
                  title: title,
                  description: description,
                  image: image,
                  is_blocked: false,
              });
              await data.save();
              res.json({ success: true });
          }
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  

module.exports = {
  loadBanner,
  loadAddBanner,
  addBanner,
};
