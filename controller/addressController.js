const Address = require("../model/addressModel");
const User = require("../model/userModel");
const Cart = require("../model/cartModel");

//-------------------MULTIPLE ADDRESS ADDING-----------------

const addMultiAaddress = async (req, res) => {
  try {
    const user = req.session.user_id;
    const addressData = await Address.findOne({ user: user });
    console.log("addressdata :", addressData);
    if (addressData) {
      const updated = await Address.updateOne(
        { user: user },
        {
          $push: {
            address: {
              fullname: req.body.fullname,
              mobile: req.body.mobile,
              pin: req.body.pin,
              email: req.body.email,
              houseName: req.body.houseName,
              city: req.body.city,
              state: req.body.state,
            },
          },
        }
      );
      if (updated) {
        res.json({ success: true });
      } else {
        res.json({ failed: true });
      }
    } else {
      const data = new Address({
        user: user,
        address: [
          {
            fullname: req.body.fullname,
            mobile: req.body.mobile,
            pin: req.body.pin,
            email: req.body.email,
            houseName: req.body.houseName,
            city: req.body.city,
            state: req.body.state,
          },
        ],
      });
      const saved = await data.save();
      if (saved) {
        res.json({ success: true });
      } else {
        res.json({ failed: true });
      }
    }
  } catch (error) {
    console.error(error.message);
  }
};

//---------------------------ADDRESS EDITING PAGE---------------------

const addressEditingPage = async (req, res) => {
  try {
    const addressId = req.query.id;

    const cart = await Cart.findOne({ userId: req.session.user_id });
    let cartCount = 0;
    if (cart) {
      cartCount = cart.products.length;
    }

    const addressData = await Address.findOne(
      { user: req.session.user_id, "address._id": addressId },
      { "address.$": 1 }
    );
    const address = addressData.address[0];
    console.log(address)
    res.render("addressEditPage", { cartCount, address });
  } catch (error) {
    console.error(error.message);
  }
};

//------------------------------ADDRESS EDITING--------------------

const addressEditing = async (req, res) => {
  try {
    const addressId = req.body.id;
    console.log("22222")
    const updated = await Address.updateOne(
      { user: req.session.user_id, "address._id": addressId },
      {
        $set: {
          "address.$.fullname": req.body.fullname,
          "address.$.mobile": req.body.mobile,
          "address.$.email": req.body.email,
          "address.$.houseName": req.body.houseName,
          "address.$.city": req.body.city,
          "address.$.state": req.body.state,
          "address.$.pin": req.body.pin,
        },
      }
    );
    res.json({success:true})
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  addMultiAaddress,
  addressEditingPage,
  addressEditing,
};
