const User = require("../model/userModel")
const bcrypt = require("bcrypt")
const Category = require("../model/categoryModel")
const { trace } = require("../routers/admin/adminRouts")

//----------------load admin loginpage-------------------

const adminLoginPage = async (req, res) => {
    try {
        res.render("login")
    } catch (error) {
        console.log(error)
    }
}

const adminLogin = async (req, res) => {
    try {

        const email = req.body.email
        const password = req.body.password
        if (!email) {
            res.json({ require: true })
        } else {
            if (!password) {
                res.json({ passrequire: true })
            } else {
                if (email.startsWith(" ") || email.includes(" ")) {
                    res.json({ emailspace: true })
                } else {
                    if (password.startsWith(" ") || password.includes(" ")) {
                        res.json({ passwordspace: true })
                    } else {
                        let emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

                        if (!emailPattern.test(req.body.email)) {

                            res.json({ emailPatt: true })
                        } else {
                            const adminData = await User.findOne({ email: email })
                            if (adminData) {

                                if (adminData.is_admin === 0) {
                                    res.json({ emailnot: true })

                                } else {

                                    const passwordMatch = await bcrypt.compare(password, adminData.password)

                                    if (passwordMatch) {
                                        req.session.admin_id = adminData._id
                                        res.json({ success: true })
                                    } else {
                                        res.json({ wrongpass: true })
                                    }
                                }

                            } else {
                                res.json({ notregister: true })
                            }
                        }
                    }
                }
            }

        }

    } catch (error) {
        console.log(error)
    }
}

//---------------------load Dashboard----------------

const loadDashboard = async (req, res) => {
    try {
        res.render("home")
    } catch (error) {
        console.log(error)
    }
}

//-------------------------Log out---------------------

const logout = async (req, res) => {
    try {
        req.session.destroy()
        res.redirect("/admin")
    } catch (error) {
        console.log(error)
    }
}

//-----------------------User Management--------------------

const usermanagementload = async (req, res) => {
    try {
        const userData = await User.find({ is_admin: 0 })
        res.render("usermanagement", { users: userData })
    } catch (error) {
        console.log(error)
    }
}

//--------------------BLOCK OR UNBLOCK USER----------------

const blockUser = async (req, res) => {
    try {
        console.log("1")
        const userId = req.body.userId
        console.log(userId)
        const blockedUser = await User.findOne({ _id: userId })
        console.log(blockedUser)
        if (blockedUser.is_block == 0) {
            console.log("2")
            await User.updateOne({ _id: userId }, { $set: { is_block: 1 } })
            // res.redirect("/admin/usermanagement")
            res.json({success:true})
        } else {
            console.log("3")
            await User.updateOne({ _id: userId }, { $set: { is_block: 0 } })
            // res.redirect("/admin/usermanagement")
            res.json({success:true})
        }

    } catch (error) {
        console.log(error)
    }
}

//----------------LOAD CATEGORY MANAGEMENT-----------------

const loadcategory = async (req, res) => {
    try {

        const categoryData = await Category.find()
        res.render("categorymanagement", { categoryData: categoryData })

    } catch (error) {
        console.log(error)
    }
}

//--------------------BLOCK AND UNBLOCK CATEGORY-----------

const blockCategory = async (req, res) => {
    try {

        const blockedcategory = await Category.findOne({ _id: req.body.catId })
        if (blockedcategory.blocked == 0) {
            await Category.updateOne({ _id: req.body.catId }, { $set: { blocked: 1 } })
            // res.redirect("/admin/categorymanagement")
            res.json({success:true})
        } else {
            await Category.updateOne({ _id: req.body.catId }, { $set: { blocked: 0 } })
            // res.redirect("/admin/categorymanagement")
            res.json({success:true})
        }

    } catch (error) {
        console.log(error)
    }
}

//----------------LOAD ADD CATEGORY-----------------

const loadAddCategory = async (req, res) => {

    try {

        res.render("addcategory")

    } catch (error) {
        console.log(error)
    }

}

//----------------------ADDING CATEGORY--------------

const addCategory = async (req, res) => {
    try {

        const name = req.body.categoryname
        const data = new Category({
            name: req.body.categoryname,
            offer: {
                discount: req.body.discount || 0,
                activationDate: req.body.activationDate || null,
                expiryDate: req.body.expiryDate || null,
            },
        })
        const already = await Category.findOne({ name: { $regex: name, $options: "i" } });
        if (already) {
            res.render("addcategory", { message: "Entered category is already exist." });
        } else {
            const categoryData = await data.save();
            res.redirect("/admin/categorymanagement");
        }

    } catch (error) {
        console.log(error)
    }
}

//----------------LOAD EDIT CATEGORY PAGE--------------

const loadeditCategory = async (req, res) => {
    try {

        const categoryId = req.query.id
        const category = await Category.findOne({ _id: categoryId })
        res.render("editcategory", { category: category })

    } catch (error) {
        console.log(error)
    }
}

//--------------------UPDATE CATEGORY-------------

const updateCategory = async (req, res) => {
    try {
        const name = req.body.categoryName
        const already = await Category.findOne({ name: { $regex: name, $options: "i" } });
        if(already){
            res.render("addcategory", { message: "Entered category is already exist." });
        }else{
            const categoryId = req.query.id
            const updatecategory = await Category.updateOne({ _id: categoryId }, { $set: { name: req.body.categoryName } })
            if (updatecategory) {
                res.redirect("/admin/categorymanagement")
            } else {
                res.render("editcategory", { message: "There is an error occured, try again!" })
            }
        }
        
    } catch (error) {
        console.log(error)
    }
}

//----------------------DELETE CATEGORY IN CATEGORY MANAGEMENT----------------------

const deleteCategory = async (req, res) => {
    try {

        await Category.deleteOne({ _id: req.query.id })
        res.redirect("/admin/categorymanagement")

    } catch (error) {
        console.log(error)
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
    deleteCategory,
}