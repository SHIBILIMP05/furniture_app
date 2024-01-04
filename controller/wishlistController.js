const User = require("../model/userModel");
const Products = require("../model/productsModel");
const Cart = require("../model/cartModel");

//---------------- LOAD WISHLIST PAGE ----------------

const loadWishlist = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.session.user_id });
    const wishlist = user.wishlist.items;
    let wishCount = 0
    if(wishlist){
      wishCount = wishlist.length;
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

//-------------- ADD TO WISHLIST ------------

const addToWishlist = async (req, res, next) => {
  try {
    const productId = req.body.id;
    const userId = req.session.user_id;

    if (userId !== undefined) {
      const productData = await Products.findOne({ _id: productId });
      const wishlistItems = {
        productId: productId,
        proName: productData.name,
        quantity: productData.quantity,
        price: productData.price,
        images: productData.images.image1,
      }

      await User.findOneAndUpdate(
        { _id: userId },
        { $push: { "wishlist.items": wishlistItems } }
      )
     
      
      res.json({ success: true });
    } else {
      res.json({ login: true });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//------------------- REMOVE FROM WISHLIST ----------------------

const removeFromWishlist = async (req, res, next) => {
  try {
    const productId = req.body.product;
    const userId = req.session.user_id;
     
    console.log(productId);
    const user = await User.findOne({ _id: userId });
    const updatedWishlist = user.wishlist.items.filter(
      (item) => item.productId !== productId

    )

    console.log("updated uesr:",updatedWishlist)
    await User.findOneAndUpdate(
      { _id: userId },
      { $set:{wishlist:{items:updatedWishlist}}}
    )

    res.json({remove:true})
    
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = { loadWishlist , addToWishlist , removeFromWishlist};
