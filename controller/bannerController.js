const Banner = require("../model/bannerModel");
const path = require("path")
const fs = require("fs")
//----------------------LOAD BANNER PAGE -------------------
const loadBanner = async (req, res) => {
  try {

    const banner = await Banner.find();
    res.render("banner", { banner });
  } catch (error) {
    console.error(error);
    res.status(500).render("500");
  }
};

//---------------------- LOAD ADD BANNER PAGE -------------------

const loadAddBanner = async (req, res) => {
  try {
    res.render("addBanner");
  } catch (error) {
    console.error(error);
    res.status(500).render("500");
  }
};

//------------- ADD BANNER -------------------
const addBanner = async (req, res) => {
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
    console.error(error);
    res.status(500).render("500");
  }
};

//----------------------- BLOCK AND UNBLOCK BANNER -------------------

const blockBanner = async (req, res) => {
  try {
    const bannerId = req.body.bannerId;
    const blockedBanner = await Banner.findOne({ _id: bannerId });
    if (!blockedBanner.is_blocked) {
      await Banner.updateOne({ _id: bannerId }, { $set: { is_blocked: true } });
      res.json({ success: true });
    } else {
      await Banner.updateOne(
        { _id: bannerId },
        { $set: { is_blocked: false } }
      );
      res.json({ success: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).render("500");
  }
};

//---------------------- DELETE BANNER -------------------

const deleteBanner = async (req, res) => {
  try {
    const bannerId = req.body.bannerId;
    await Banner.deleteOne({ _id: bannerId });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).render("500");
  }
};

//---------------------- LOAD EDIT BANNER PAGE -------------------
const loadEditBanner = async (req, res) => {
  try {
    const bannerId = req.query.id;
    const banner = await Banner.findOne({ _id: bannerId });
    res.render("editBanner", { banner });
  } catch (error) {
    console.error(error);
    res.status(500).render("500");
  }
};

//---------------------- EDIT BANNER -------------------
const editBanner = async (req, res) => {
  try {
    const bannerId = req.body.bannerId;
    const image = req.file ? req.file.filename : undefined;
    const banner = await Banner.findOne({ _id: bannerId });
    const oldImg = image ? banner.image : null;

    if (oldImg) {
      let imagePath = path.resolve("public/banner", oldImg);
      fs.unlinkSync(imagePath);
    }
    await Banner.updateOne(
      { _id: bannerId },
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          image: image ? image : oldImg,
        },
      }
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.render(500);
  }
};

module.exports = {
  loadBanner,
  loadAddBanner,
  addBanner,
  blockBanner,
  deleteBanner,
  loadEditBanner,
  editBanner,
};
