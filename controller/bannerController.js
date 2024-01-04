const Banner = require("../model/bannerModel");

//----------------------LOAD BANNER PAGE -------------------
const loadBanner = async (req, res, next) => {
    try {
        const banner = await Banner.find();
        res.render("banner", { banner })
    } catch (error) {
        console.log(error);
        next(error)
    }
}

//---------------------- LOAD ADD BANNER PAGE -------------------

const loadAddBanner = async (req, res, next) => {
    try {
        res.render("addBanner");
    } catch (error) {
        console.log(error);
        next(error)
    }
}

module.exports = {
    loadBanner,
    loadAddBanner

}