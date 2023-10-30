const User = require("../model/userModel")
const bcrypt = require("bcrypt")


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

module.exports = {
    adminLoginPage,
    adminLogin,
    loadDashboard,
    logout,
    usermanagementload,
    blockUser,
}