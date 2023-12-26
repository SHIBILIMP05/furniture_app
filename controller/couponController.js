const Coupon = require("../model/couponsModel");
const Cart = require("../model/cartModel");
//------------ LOAD COUPON MANAGEMENT ------------

const loadCouponManagement = async (req, res, next) => {
  try {
    const coupon = await Coupon.find();
    res.render("couponManagement", { coupon });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//------------------ LOAD ADD COUPON --------------------

const loadAddCoupon = async (req, res, next) => {
  try {
    res.render("addCoupon");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//------------------ ADD COUPON ADMIN SIDE ---------------

const addCoupon = async (req, res, next) => {
  try {
    const coupenData = await Coupon.findOne({ couponCode: req.body.code });
    if (coupenData) {
      res.json({ exist: true });
    } else {
      console.log(req.body);
      const data = new Coupon({
        name: req.body.name,
        couponCode: req.body.code,
        discountAmount: req.body.discount,
        activationDate: req.body.activationDate,
        expiryDate: req.body.expiryDate,
        criteriaAmount: req.body.criteriaAmount,
        usersLimit: req.body.userLimit,
      });
      await data.save();
      res.json({ success: true });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//------------------ block and unblock coupon ------------
const blockCoupon = async (req, res, next) => {
  try {
    const id=req.body.copId
    const coupon = await Coupon.findOne({ _id: id });
    if(!coupon.is_blocked){
      await Coupon.updateOne({ _id: id }, { $set: { is_blocked: true } });
      res.json({success:true})
    }else{
      await Coupon.updateOne({ _id: id }, { $set: { is_blocked: false } });
      res.json({success:true})
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

//--------------- LOAD EDITE COUPON -------------------
const loadEditeCoupon = async (req, res, next) => {
  try {
    const copId = req.query._id;
    const coupon = await Coupon.findById(copId);
    res.render("editCoupon", { coupon });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

//--------------- EDITE COUPON -------------------
const EditeCoupon = async (req, res, next) => {
  try {
    const coupenData = await Coupon.findOne({ couponCode: req.body.code });
   console.log(coupenData);
    if (coupenData) {
      res.json({ exist: true });
    } else {
      
       await Coupon.findOneAndUpdate({_id:coupenData._id},
        {
            name:req.body.name,
            couponCode:req.body.code,
            discountAmount:req.body.discount,
            activationDate:req.body.activationDate,
            expiryDate:req.body.expiryDate,
            criteriaAmount:req.body.criteriAamount,
            usersLimit:req.body.userLimit,

        })
      res.json({ success: true });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

//--------------- APPLY COUPON -----------------
const applyCoupon = async (req, res, next) => {
  try {
    const code = req.body.code;
    const amount = Number(req.body.amount);
    const userExist = await Coupon.findOne(
      { couponCode: code ,usedUsers: req.session.user_id },
     
    );
    if (userExist) {
      res.json({ user: true });
    } else {
      const coupenData = await Coupon.findOne({ couponCode: code });
      if (coupenData) {
        if (coupenData.usersLimit <= 0) {
          res.json({ limit: true });
        } else {
          if (coupenData.expiryDate <= new Date()) {
            res.json({ expired: true });
          } else {
            if (coupenData.criteriaAmount >= amount) {
              res.json({ cartAmount: true });
            } else {
              const disAmount = coupenData.discountAmount;
              const disTotal = Math.round(amount - disAmount);
              await Cart.updateOne(
                { userId: req.session.user_id },
                { $set: { applied: "applied" } }
              );
              return res.json({ amountOkey: true, disAmount, disTotal });
            }
          }
        }
      } else {
        res.json({ invalid: true });
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//--------------- UNAPPLAY COUPON -----------------

const unApplayCoupon = async (req, res, next) => {
  try {
    const code = req.body.code;
    const couponData = await Coupon.findOne({ couponCode: code });
    const amount = Number(req.body.amount);
    const disAmount = couponData.discountAmount;
    const disTotal = Math.round(amount + disAmount);
    const deleteApplied = await Cart.updateOne(
      { userId: req.session.user_id },
      { $set: { applied: "not" } }
    );
    if (deleteApplied) {
      res.json({ success: true, disTotal });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  loadCouponManagement,
  loadAddCoupon,
  addCoupon,
  applyCoupon,
  unApplayCoupon,
  blockCoupon,
  loadEditeCoupon,
  EditeCoupon,
};
