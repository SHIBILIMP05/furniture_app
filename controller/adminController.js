const User = require("../model/userModel")
const bcrypt = require("bcrypt")
const Category = require("../model/categoryModel")

//----------------load admin loginpage-------------------

const adminLoginPage = async(req,res)=>{
    try {
        res.render("login")
    } catch (error) {
        console.error(error.message)
    }
}

//-----------------admin login------------------------------

const adminLogin = async (req,res)=>{
    try {

        const email = req.body.email
        const password = req.body.password

        const adminData = await User.findOne({email:email})
        
        if(adminData){

            if(adminData.is_admin === 0){
                res.render("login",{message:"Please enter valid mail"})
                
            }else{

            const passwordMatch = await bcrypt.compare(password,adminData.password)

               if(passwordMatch){
                    req.session.admin_id = adminData._id
                    res.redirect("/admin/home")
                }else{
                    res.render("login",{message:"Invalid password"})
                }
            }

        }else{
            res.render("login",{message:"Please enter valid email"})
        }
    } catch (error) {
        console.error(error.message)
    }
}

//---------------------load Dashboard----------------

const loadDashboard = async (req,res)=>{
    try {
        res.render("home")
    } catch (error) {
        console.error(error.message)
    }
}

//-------------------------Log out---------------------

const logout = async (req,res)=>{
    try {
        req.session.destroy()
        res.redirect("/admin")
    } catch (error) {
        console.error(error.message)
    }
}

//-----------------------User Management--------------------

const usermanagementload  = async(req,res)=>{
    try {
        const userData = await User.find({is_admin:0})
        res.render("usermanagement",{users:userData})
    } catch (error) {
        console.error(error.message)
    }
}

//--------------------BLOCK OR UNBLOCK USER----------------

const blockUser = async(req,res)=>{
    try {
        
        const blockedUser = await User.findOne({_id:req.query.id})
        if(blockedUser.is_block == 0){
            await User.updateOne({_id:req.query.id},{$set:{is_block:1}})
            res.redirect("/admin/usermanagement")
        }else{

            await User.updateOne({_id:req.query.id},{$set:{is_block:0}})
            res.redirect("/admin/usermanagement")
        }

    } catch (error) {
        console.error(error.message)
    }
}

//----------------LOAD CATEGORY MANAGEMENT-----------------

const loadcategory = async(req,res)=>{
    try {
        
        const categoryData = await Category.find()
        res.render("categorymanagement",{categoryData:categoryData})

    } catch (error) {
        console.error(error.message)
    }
}

//--------------------BLOCK AND UNBLOCK CATEGORY-----------

const blockCategory = async (req,res)=>{
    try {
        
       const blockedcategory = await Category.findOne({_id:req.query.id})
       if(blockedcategory.blocked == 0){
            await Category.updateOne({_id:req.query.id},{$set:{blocked:1}})
            res.redirect("/admin/categorymanagement")
       }else{
        await Category.updateOne({_id:req.query.id},{$set:{blocked:0}})
        res.redirect("/admin/categorymanagement")
       } 

    } catch (error) {
        console.error(error.message)
    }
}

//----------------LOAD ADD CATEGORY-----------------

const loadAddCategory = async(req,res)=>{

    try {
        
        res.render("addcategory")

    } catch (error) {
        console.error(error.message)
    }

}

//----------------------ADDING CATEGORY--------------

const addCategory = async(req,res)=>{
    try {
        
        const name = req.body.categoryname
        const data = new Category({
             name : req.body.categoryname

        })
        const already = await Category.findOne({name: { $regex: name, $options: "i" }});
          if (already) {
            res.render("addcategory", {message: "Entered category is already exist."});
          } else {
            const categoryData = await data.save();
            res.redirect("/admin/categorymanagement");
          }

    } catch (error) {
        console.error(error.message)
    }
}
  
//----------------LOAD EDIT CATEGORY PAGE--------------

const loadeditCategory = async(req,res)=>{
    try { 
        
        const categoryId =req.query.id 
        const category = await Category.findOne({_id:categoryId})
        res.render("editcategory",{category:category})

    } catch (error) {
        console.error(error.message)
    }
}

//--------------------UPDATE CATEGORY-------------

const updateCategory = async(req,res)=>{
    try {
        
        const categoryId =req.query.id
        const updatecategory = await Category.updateOne({_id:categoryId},{$set:{name:req.body.categoryName}})
        if(updatecategory){
            res.redirect("/admin/categorymanagement")
        }else{
            res.render("editcategory",{message:"There is an error occured, try again!"})
        }
    } catch (error) {
        console.error(error.message)
    }
}

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
}