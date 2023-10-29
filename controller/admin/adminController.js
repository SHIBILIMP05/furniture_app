const User = require("../../model/userModel")
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
                res.render("login",{message:"please verify your mail"})
                
            }else{

            const passwordMatch = await bcrypt.compare(password,adminData.password)

               if(passwordMatch){
                    req.session.user_id = adminData._id
                    res.redirect("/admin/home")
                }else{
                    res.render("login",{message:"Invalid password"})
                }
            }

        }else{
            res.render("login",{message:"please enter valid email"})
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
module.exports = {
    adminLoginPage,
    adminLogin,
    loadDashboard,
    logout,
}