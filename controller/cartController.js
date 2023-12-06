const User = require("../model/userModel")
const Cart = require("../model/cartModel")
const Products = require("../model/productsModel")

//----------------------LOAD CART PAGE -------------------

const loadCart = async (req, res) => {
    try {
        const userId = req.session.user_id
        const userName = req.session.name;
        const cartData = await Cart.findOne({
            userId: userId,
        }).populate("products.productId");

        const cart = await Cart.findOne({ userId: req.session.user_id })
        let cartCount = 0;
        if (cart) { cartCount = cart.products.length }

        const session = req.session.user_id;
        if (cartData) {
            if (cartData.products.length > 0) {
                const products = cartData.products;

                let total = 0;
                for (let i = 0; i < products.length; i++) {
                    total += products[i].totalPrice
                }

                const totalamount = total;
                const userId = userName._id;
                const userData = await User.find();

                res.render("cartPage", {
                    products: products,
                    Total: total,
                    userId,
                    session,
                    totalamount,
                    user: userName,
                    cartCount,
                    name:req.session.name
                });
            } else {
                res.render("cartPage", { cartCount });
                console.log("empty cart");
            }
        } else {
            res.render("cartPage", { cartCount });
            console.log("no products in cart");
        }
    } catch (error) {
        console.error(error.message)
    }
}

//--------------------ADD PRODUCTS TO CART----------------

const addToCart = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const userData = await User.findOne({ _id: userId });

        const proId = req.body.id;
        const productData = await Products.findOne({ _id: proId });
        const productQuantity = productData.quantity;

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
            });
            await cartData.save();
        }

        res.json({ success: true });
    } catch (error) {
        console.error(error.message)
    }
}

//--------------------REMOVE PRODUCTS FROM CART-----------

const removeCartItem = async (req, res, next) => {
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
      console.log(error.message);
      res.status(500).json({ error: 'Internal server error' });
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
      console.log(error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

module.exports = {
    loadCart,
    addToCart,
    removeCartItem,
    quantityUpdation,
    
}