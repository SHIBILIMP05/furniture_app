const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const Category = require("../model/categoryModel");
const { trace } = require("../routers/admin/adminRouts");
const Order = require("../model/ordersModel");
/* const puppeteer = require('puppeteer') */
const ExcelJS = require('exceljs')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs');
const { log } = require("console");

//----------------load admin loginpage-------------------

const adminLoginPage = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error);
    res.status(500).render("500")
  }
};

const adminLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email) {
      res.json({ require: true });
    } else {
      if (!password) {
        res.json({ passrequire: true });
      } else {
        if (email.startsWith(" ") || email.includes(" ")) {
          res.json({ emailspace: true });
        } else {
          if (password.startsWith(" ") || password.includes(" ")) {
            res.json({ passwordspace: true });
          } else {
            let emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

            if (!emailPattern.test(req.body.email)) {
              res.json({ emailPatt: true });
            } else {
              const adminData = await User.findOne({ email: email });
              if (adminData) {
                if (adminData.is_admin === 0) {
                  res.json({ emailnot: true });
                } else {
                  const passwordMatch = await bcrypt.compare(
                    password,
                    adminData.password
                  );

                  if (passwordMatch) {
                    req.session.admin_id = adminData._id;
                    res.json({ success: true });
                  } else {
                    res.json({ wrongpass: true });
                  }
                }
              } else {
                res.json({ notregister: true });
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).render("500")
  }
};

//---------------------load Dashboard----------------

const loadDashboard = async (req, res) => {
  try {
    const currentDate = new Date();
    const startDate = new Date(currentDate - 30 * 24 * 60 * 60 * 1000);
    const userData = await User.find();
    const usersCount = userData.length;
    let soldProducts = 0;
    const orderData = await Order.find({
      date: { $gte: startDate, $lt: currentDate },
    });
    const revenue = orderData
      ? orderData.reduce((acc, item) => {
          const deliveredData = item.products.filter(
            (product) => product.status == "Delivered"
          );
          const productsSum = deliveredData.reduce(
            (sum, product) => sum + product.totalPrice,
            0
          );
          return acc + productsSum;
        }, 0)
      : 0;
    const totalOrders = orderData ? orderData.length : 0;
    const deliveredOrders = orderData
      ? orderData.reduce((acc, item) => {
          const deliveredData = item.products.filter(
            (product) => product.status == "Delivered"
          );
          return acc + deliveredData.length;
        }, 0)
      : 0;
    const cancelledOrders = orderData
      ? orderData.reduce((acc, item) => {
          const deliveredData = item.products.filter(
            (product) => product.status == "cancelled"
          );
          return acc + deliveredData.length;
        }, 0)
      : 0;

    for (let i = 0; i < orderData.length; i++) {
      for (let j = 0; j < orderData[i].products.length; j++) {
        soldProducts += orderData[i].products[j].count;
      }
    }
    let data = [];
    let ind = 0;

    const monthlyOrderCounts = await Order.aggregate([
        {
          $match: {
            "products.status":"Delivered"
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%m', date: '$date' } },
            count: { $sum: 1 },
          },
        },
      ]);

      if(monthlyOrderCounts.length !=0){
        for(let i=0;i<12;i++){

          // if(i+1<monthlyOrderCounts[0]._id){
          //   data.push(0)
          // }else{
            if( monthlyOrderCounts[ind]){
              let count = monthlyOrderCounts[ind].count
              data.push(count)
            }else{
              data.push(0)
            }
            ind++
          // }
        }
      }

      const paymentMethodsData = await Order.aggregate([
        {
          $match: {
            "products.status":"Delivered"
          },
        },
        {
          $group: {
            _id: '$paymentMethod',
            count: { $sum: 1 },
          },
        },
      ])

    res.render("home", {
      usersCount,
      revenue,
      totalOrders,
      deliveredOrders,
      cancelledOrders,
      soldProducts,
      monthlyOrderCounts,
      data,
      paymentMethodsData
    });
  } catch (error) {
    console.log(error);
    res.status(500).render("500")
  }
};

//-------------------------Log out---------------------

const logout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/admin");
  } catch (error) {
    console.log(error);
    res.status(500).render("500")
  }
};

//-----------------------User Management--------------------

const usermanagementload = async (req, res) => {
  try {
    const userData = await User.find({ is_admin: 0 });
    res.render("usermanagement", { users: userData });
  } catch (error) {
    console.log(error);
    res.status(500).render("500")
  }
};

//--------------------BLOCK OR UNBLOCK USER----------------

const blockUser = async (req, res) => {
  try {
    const userId = req.body.userId;
    const blockedUser = await User.findOne({ _id: userId });
    if (blockedUser.is_block == 0) {
      await User.updateOne({ _id: userId }, { $set: { is_block: 1 } });
      // res.redirect("/admin/usermanagement")
      res.json({ success: true });
    } else {
      await User.updateOne({ _id: userId }, { $set: { is_block: 0 } });
      // res.redirect("/admin/usermanagement")
      res.json({ success: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).render("500")
  }
};

//----------------LOAD CATEGORY MANAGEMENT-----------------

const loadcategory = async (req, res) => {
  try {
    const categoryData = await Category.find();
    res.render("categorymanagement", { categoryData: categoryData });
  } catch (error) {
    console.log(error);
    res.status(500).render("500")
  }
};

//--------------------BLOCK AND UNBLOCK CATEGORY-----------

const blockCategory = async (req, res) => {
  try {
    const blockedcategory = await Category.findOne({ _id: req.body.catId });
    if (blockedcategory.blocked == 0) {
      await Category.updateOne(
        { _id: req.body.catId },
        { $set: { blocked: 1 } }
      );
      // res.redirect("/admin/categorymanagement")
      res.json({ success: true });
    } else {
      await Category.updateOne(
        { _id: req.body.catId },
        { $set: { blocked: 0 } }
      );
      // res.redirect("/admin/categorymanagement")
      res.json({ success: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).render("500")
  }
};

//----------------LOAD ADD CATEGORY-----------------

const loadAddCategory = async (req, res) => {
  try {
    res.render("addcategory");
  } catch (error) {
    console.log(error);
    res.status(500).render("500")
  }
};

//----------------------ADDING CATEGORY--------------

const addCategory = async (req, res) => {
  try {
    const name = req.body.categoryname;
    const data = new Category({
      name: req.body.categoryname,
      offer: {
        discount: req.body.discount || 0,
        activationDate: req.body.activationDate || null,
        expiryDate: req.body.expiryDate || null,
      },
    });
    const already = await Category.findOne({
      name: { $regex: name, $options: "i" },
    });
    if (already) {
      res.render("addcategory", {
        message: "Entered category is already exist.",
      });
    } else {
      const categoryData = await data.save();
      res.redirect("/admin/categorymanagement");
    }
  } catch (error) {
    console.log(error);
    res.status(500).render("500")
  }
};

//----------------LOAD EDIT CATEGORY PAGE--------------

const loadeditCategory = async (req, res) => {
  try {
    const categoryId = req.query.id;
    const category = await Category.findOne({ _id: categoryId });
    res.render("editcategory", { category: category });
  } catch (error) {
    console.log(error);
    res.status(500).render("500")
  }
};

//--------------------UPDATE CATEGORY-------------

const updateCategory = async (req, res) => {
  try {
    const name = req.body.categoryName;
    const already = await Category.findOne({
      name: { $regex: name, $options: "i" },
    });
    if (already) {
      res.render("addcategory", {
        message: "Entered category is already exist.",
      });
    } else {
      const categoryId = req.query.id;
      const updatecategory = await Category.updateOne(
        { _id: categoryId },
        { $set: { name: req.body.categoryName } }
      );
      if (updatecategory) {
        res.redirect("/admin/categorymanagement");
      } else {
        res.render("editcategory", {
          message: "There is an error occured, try again!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).render("500")
  }
};

//----------------------DELETE CATEGORY IN CATEGORY MANAGEMENT----------------------

const deleteCategory = async (req, res) => {
  try {
    await Category.deleteOne({ _id: req.query.id });
    res.redirect("/admin/categorymanagement");
  } catch (error) {
    console.log(error);
    res.status(500).render("500")
  }
};

// -------------------- LOAD SALES MANAGEMENT --------------------

const loadSalesManagement = async (req, res) => {
  try {
    const users = await User.find({is_block:0});
    
    
    const orderData = await Order.aggregate([
      { $unwind: "$products" },
      { $match: {"products.status":"Delivered" } },
      { $sort: { date: -1 } },
      {
        $lookup: {
          from: "products",
          let: { productId: { $toObjectId: "$products.productId" } },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$productId"] } } }],
          as: "products.productDetails",
        },
      },
      {
        $addFields: {
          "products.productDetails": {
            $arrayElemAt: ["$products.productDetails", 0],
          },
        },
      },
    ]);

    

    res.render("salesManagemment", {
      orders: orderData,users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).render("500")
  }
};

// -------------------- SALES SORTING --------------------

const saleSortPage = async (req,res)=>{
  try {
    const duration = parseInt(req.params.id);
    const currentDate = new Date();
    const startDate = new Date(currentDate - duration * 24 * 60 * 60 * 1000);

    const orders = await Order.aggregate([
      {
        $unwind: "$products",
      },
      {
        $match: {
          "products.status":"Delivered",
          date: { $gte: startDate, $lt: currentDate },
        },
      },
      {
        $sort: { date: -1 },
      },
      {
        $lookup: {
          from: "products",
          let: { productId: { $toObjectId: "$products.productId" } },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$productId"] } } }],
          as: "products.productDetails",
        },
      },
      {
        $addFields: {
          "products.productDetails": {
            $arrayElemAt: ["$products.productDetails", 0],
          },
        },
      },
    ]);


    res.render('salesManagemment', { orders });
  } catch (error) {
    console.log(error);
    res.status(500).render("500")
  }
}

// -------------------- DOWNLOAD SALES REPORT PDF AND EXCEL -------------------

const downloadReport = async (req, res) => {
  try {
    const format = req.query.format;
    const duration = parseInt(req.query.duration)
    const currentDate = new Date();
    const startDate = new Date(currentDate - duration * 24 * 60 * 60 * 1000);
    const orders = await Order.aggregate([
      {
        $unwind: "$products",
      },
      {
        $match: {
          "products.status":"Delivered",
          date: { $gte: startDate, $lt: currentDate },
        },
      },
      {
        $sort: { date: -1 },
      },
      {
        $lookup: {
          from: "products",
          let: { productId: { $toObjectId: "$products.productId" } },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$productId"] } } }],
          as: "products.productDetails",
        },
      },
      {
        $addFields: {
          "products.productDetails": {
            $arrayElemAt: ["$products.productDetails", 0],
          },
        },
      },
    ]);
    const date = new Date()
    data = {
      orders,
      date,
    }

    /*if (format === 'pdf') {
      const filepathName = path.resolve(__dirname, "../views/admin/ReportPdf.ejs");
      const html = fs.readFileSync(filepathName).toString();
      const ejsData = ejs.render(html, data);

      const browser = await puppeteer.launch({ headless: "new"});
      const page = await browser.newPage();
      await page.setContent(ejsData, { waitUntil: "networkidle0"});
      const pdfBytes = await page.pdf({ format: "letter" });
      await browser.close();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename= Sales Report.pdf"
    );
    res.send(pdfBytes);
    } else */ 
    if (format === 'excel') {
      // Generate and send an Excel report
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sales Report');

      // Add data to the Excel worksheet (customize as needed)
      worksheet.columns = [
        { header: 'Order ID', key: 'orderId', width: 8 },
        { header: 'Product Name', key: 'productName', width: 50 },
        { header: 'Qty', key: 'qty', width: 5 },
        { header: 'Date', key: 'date', width: 12 },
        { header: 'Customer', key: 'customer', width: 15 },
        { header: 'Total Amount', key: 'totalAmount', width: 12 },
      ];
      // Add rows from the reportData to the worksheet
      orders.forEach((data) => {
        worksheet.addRow({
          orderId: data.uniqueId,
          productName: data.products.productDetails.name,
          qty: data.products.count,
          date: data.date.toLocaleDateString('en-US', { year:
            'numeric', month: 'short', day: '2-digit' }).replace(/\//g,
            '-'),
          customer: data.userName,
          totalAmount: data.products.totalPrice,
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=sales_report.xlsx`);
      const excelBuffer = await workbook.xlsx.writeBuffer();
      res.end(excelBuffer);
    } else {
      // Handle invalid format
      res.status(400).send('Invalid format specified');
    }
  } catch (error) {
    console.log(error);
    res.status(500).render("500")
  }
};

module.exports = {
  adminLoginPage,
  adminLogin,
  loadDashboard,
  logout,
  usermanagementload,
  blockUser,
  loadcategory,
  loadAddCategory,
  addCategory,
  blockCategory,
  loadeditCategory,
  updateCategory,
  deleteCategory,
  loadSalesManagement,
  saleSortPage,
  downloadReport
};
