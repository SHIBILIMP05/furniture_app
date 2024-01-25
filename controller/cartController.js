const User = require("../model/userModel");
const Cart = require("../model/cartModel");
const Products = require("../model/productsModel");

//----------------------LOAD CART PAGE -------------------

const loadCart = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const userName = req.session.name;
    const cartData = await Cart.findOne({
      userId: userId,
    }).populate("products.productId");

    const cart = await Cart.findOne({ userId: req.session.user_id });
    let cartCount = 0;
    if (cart) {
      cartCount = cart.products.length;
    }
    const user = await User.findOne({ _id: req.session.user_id });
    const wishlist = user.wishlist.items;
    let wishCount = 0;
    if (wishlist) {
      wishCount = wishlist.length;
    }
    const session = req.session.user_id;
    if (cartData) {
      if (cartData.products.length > 0) {
        const products = cartData.products;

        let total = 0;
        for (let i = 0; i < products.length; i++) {
          total += products[i].totalPrice;
        }

        const totalamount = total;
        const userId = userName._id;
        await User.find();

        res.render("cartPage", {
          products: products,
          Total: total,
          userId,
          session,
          totalamount,
          user: userName,
          cartCount,
          wishCount,
          name: req.session.name,
        });
      } else {
        res.render("cartPage", {
          cartCount,
          wishCount,
          name: req.session.name,
        });
      }
    } else {
      res.render("cartPage", { cartCount, wishCount, name: req.session.name });
    }
  } catch (error) {
    console.log(error)
    res.status(500).render("500")
  }
};

//-------------------- ADD PRODUCTS TO CART ----------------

const addToCart = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const userData = await User.findOne({ _id: userId });

    const proId = req.body.id;
    const productData = await Products.findOne({ _id: proId });
    const productQuantity = productData.quantity;
    const proname = productData.name;
    const category = productData.category;
    const proImage = productData.images.image1;

    if (userId === undefined) {
      res.json({ login: true, message: "Please login and continue shopping!" });
      res.redirect("/");
    }
    const cartData = await Cart.findOneAndUpdate(
      { userId: userId },
      {
        $setOnInsert: {
          userId: userId,
          userName: userData.name,
          products: [],
        },
      },
      { upsert: true, new: true }
    );
    const updatedProduct = cartData.products.find(
      (product) => product.productId === proId
    );
    const updatedQuantity = updatedProduct ? updatedProduct.count : 0;
    if (updatedQuantity + 1 > productQuantity) {
      return res.json({
        success: false,
        message: "Quantity limit reached!",
      });
    }

    const price = productData.price;
    const total = price;

    if (updatedProduct) {
      await Cart.updateOne(
        { userId: userId, "products.productId": proId },
        {
          $inc: {
            "products.$.count": 1,
            "products.$.totalPrice": total,
          },
        }
      );
    } else {
        cartData.products.push({
        productId: proId,
        productPrice: total,
        totalPrice: total,
        image: proImage,
        category: category,
        proName: proname,
      });
      await cartData.save();
    }

    res.json({ success: true });
  } catch (error) {
    console.log(error)
    res.status(500).render("500")
  }
};

//--------------------REMOVE PRODUCTS FROM CART-----------

const removeCartItem = async (req, res) => {
  try {
    const userId = req.session.user_id;
    const proId = req.body.product;
    const cartData = await Cart.findOne({ userId: userId });

    if (cartData) {
      await Cart.findOneAndUpdate(
        { userId: userId },
        {
          $pull: { products: { productId: proId } },
        }
      );
      res.json({ success: true });
    }
  } catch (error) {
    console.log(error)
    res.status(500).render("500")
  }
};

//--------------------------QUANTITY UPDATION------------------

const quantityUpdation = async (req, res) => {
  try {
    const userData = req.session.user_id;
    const proId = req.body.product;
    let count = req.body.count;
    count = parseInt(count);

    const cartData = await Cart.findOne({ userId: userData });
    const product = cartData.products.find(
      (product) => product.productId === proId
    );
    const productData = await Products.findOne({ _id: proId });
    const productQuantity = productData.quantity;
    const updatedCartData = await Cart.findOne({ userId: userData });
    const updatedProduct = updatedCartData.products.find(
      (product) => product.productId === proId
    );
    const updatedQuantity = updatedProduct.count;

    if (count > 0) {
      if (updatedQuantity + count > productQuantity) {
        res.json({ success: false, message: "Quantity limit reached!" });
        return;
      }
    } else if (count < 0) {
      // Quantity is being decreased
      if (updatedQuantity <= 1 || Math.abs(count) > updatedQuantity) {
        await Cart.updateOne(
          { userId: userData },
          { $pull: { products: { productid: proId } } }
        );
        res.json({ success: true });
        return;
      }
    }

    const cartdata = await Cart.updateOne(
      { userId: userData, "products.productId": proId },
      { $inc: { "products.$.count": count } }
    );
    const updateCartData = await Cart.findOne({ userId: userData });
    const updateProduct = updateCartData.products.find(
      (product) => product.productId === proId
    );
    const updateQuantity = updateProduct.count;
    const productPrice = productData.price;

    const productTotal = productPrice * updateQuantity;
    await Cart.updateOne(
      { userId: userData, "products.productId": proId },
      { $set: { "products.$.totalPrice": productTotal } }
    );
    res.json({ success: true });
  } catch (error) {
    console.log(error)
    res.status(500).render("500")
  }
};

module.exports = {
  loadCart,
  addToCart,
  removeCartItem,
  quantityUpdation,
};
