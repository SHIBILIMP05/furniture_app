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
  
//----------------------- BLOCK AND UNBLOCK BANNER -------------------

const blockBanner = async (req, res) => {
  try {
      const bannerId = req.body.bannerId
      const blockedBanner = await Banner.findOne({ _id: bannerId })
      if (!blockedBanner.is_blocked) {
          await Banner.updateOne({ _id: bannerId }, { $set: { is_blocked: true } })
          res.json({success:true})
      } else {
        await Banner.updateOne({ _id: bannerId }, { $set: { is_blocked: false } })
        res.json({success:true})
      }

  } catch (error) {
      next(error)
  }
}

module.exports = {
  loadBanner,
  loadAddBanner,
  addBanner,
  blockBanner,
};
