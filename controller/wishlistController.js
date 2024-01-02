const User = require("../model/userModel");
const Products = require("../model/productsModel");
const Wishlist = require("../model/wishlistModel");
const Cart = require("../model/cartModel");

//---------------- LOAD WISHLIST PAGE ----------------

const loadWishlist = async (req, res, next) => {
  try {
      const wishlist = await Wishlist.find({ userId: req.session.user_id });
      let wishCount = 0
      if(wishlist){
        wishCount = wishlist.length
      }
      const cart = await Cart.findOne({ userId: req.session.user_id });
      let cartCount = 0;
      if (cart) {
        cartCount = cart.products.length;
      }
      res.render("wishlist",{cartCount,wishCount,wishlist,name: req.session.name});
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//------------------- ADD TO WISHLIST -------------------

const addToWishlist = async (req, res, next) => {
  try {
    const productId = req.body.id;
    const userId = req.session.user_id;

    if (userId !== undefined) {
      const productData = await Products.findOne({ _id: productId });
      const wishlistData = await Wishlist.findOneAndUpdate(
        { userId: userId },
        {
          $setOnInsert: {
            userId: userId,
            proName: productData.name,
            price: productData.price,
            images: productData.images.image1,
          },
        },
        { upsert: true, new: true }
      );
      res.json({ success: true });
    } else {
      res.json({ login: true });
    }
  } catch (error) {
    console.log(error);
    next();
  }
};

module.exports = { loadWishlist , addToWishlist};
